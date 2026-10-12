package com.coding.platform.service.impl;

import com.coding.platform.dto.CompileDTO;
import com.coding.platform.entity.Problem;
import com.coding.platform.entity.SubmitRecord;
import com.coding.platform.entity.User;
import com.coding.platform.service.JudgeService;
import com.coding.platform.service.ProblemService;
import com.coding.platform.service.SubmitRecordService;
import com.coding.platform.service.UserService;
import com.coding.platform.vo.CompileResultVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.*;

/**
 * 判题机：真编译、真执行、真比对。
 * <p>
 * 多语言支持靠一张 {@link LangSpec} 表：每种语言声明「源文件名 / 编译命令 / 运行命令 / 默认模板」，
 * 判题流程本身完全共用。加语言只需要往表里加一项，不用改流程。
 * <p>
 * 三个容易踩的坑（都踩过）：
 * 1. javac 的诊断信息在 Windows 上是 GBK，按 UTF-8 读会变乱码 —— 用 -J-D 强制它输出 UTF-8。
 * 2. 解释型语言（Python/JS）没有编译步骤，语法错会变成"运行错误" —— 用 py_compile / node --check
 *    做一步语法检查，让它照样报编译错误。
 * 3. 工具链可能根本没装（本机 python 就是应用商店的占位壳）—— 所以提供可用性探测，
 *    前端只展示这台机器真能跑的语言，而不是让用户提交了才发现失败。
 */
@Slf4j
@Service
public class JudgeServiceImpl implements JudgeService {

    @Autowired
    private ProblemService problemService;

    @Autowired
    private SubmitRecordService submitRecordService;

    @Autowired
    private UserService userService;

    @Value("${judge.work-dir}")
    private String workDir;

    @Value("${judge.time-limit}")
    private Integer timeLimit;

    private static final String JAVA_HOME = System.getenv("JAVA_HOME");
    private static final String JAVAC_PATH = JAVA_HOME + "/bin/javac";
    private static final String JAVA_PATH = JAVA_HOME + "/bin/java";

    private final ExecutorService executorService = Executors.newCachedThreadPool();

    // ------------------------------------------------------------------ 语言表

    private static class LangSpec {
        final String key;                 // 提交时用的语言标识
        final String label;               // 展示名
        final String sourceName;          // 落到临时目录里的源文件名
        final List<String> compileCmd;    // 编译 / 语法检查命令（空 = 不需要）
        final String runExe;              // 运行程序（PATH 上的命令）；与 localExe 二选一
        final String localExe;            // 运行临时目录里生成的可执行文件
        final List<String> runArgs;
        final List<String> probeCmd;      // 可用性探测命令
        final String probeExpect;         // 探测输出里必须出现的字样
        final String template;            // 前端默认模板

        LangSpec(String key, String label, String sourceName, List<String> compileCmd,
                 String runExe, String localExe, List<String> runArgs,
                 List<String> probeCmd, String probeExpect, String template) {
            this.key = key;
            this.label = label;
            this.sourceName = sourceName;
            this.compileCmd = compileCmd;
            this.runExe = runExe;
            this.localExe = localExe;
            this.runArgs = runArgs;
            this.probeCmd = probeCmd;
            this.probeExpect = probeExpect;
            this.template = template;
        }
    }

    private static final Map<String, LangSpec> LANGS = new LinkedHashMap<>();

    static {
        LANGS.put("JAVA", new LangSpec(
                "JAVA", "Java", "Main.java",
                Arrays.asList(JAVAC_PATH,
                        "-J-Dfile.encoding=UTF-8", "-J-Dsun.stdout.encoding=UTF-8", "-J-Dsun.stderr.encoding=UTF-8",
                        "-encoding", "UTF-8", "Main.java"),
                JAVA_PATH, null,
                Arrays.asList("-Dfile.encoding=UTF-8", "-XX:+UseSerialGC", "-cp", ".", "Main"),
                Arrays.asList(JAVAC_PATH, "-version"), "javac",
                "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n"
                        + "        Scanner sc = new Scanner(System.in);\n\n"
                        + "        // TODO 1：按题目要求读入数据\n        // int n = sc.nextInt();\n\n"
                        + "        // TODO 2：在这里写你的算法\n\n"
                        + "        // TODO 3：输出结果\n        // System.out.println(ans);\n\n"
                        + "        sc.close();\n    }\n}\n"));

        LANGS.put("CPP", new LangSpec(
                "CPP", "C++", "Main.cpp",
                Arrays.asList("g++", "-O2", "-std=c++17", "-o", "main.exe", "Main.cpp"),
                null, "main.exe", Collections.emptyList(),
                Arrays.asList("g++", "--version"), "g++",
                "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n"
                        + "    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n"
                        + "    // TODO 1：按题目要求读入数据\n\n"
                        + "    // TODO 2：在这里写你的算法\n\n"
                        + "    // TODO 3：输出结果\n\n"
                        + "    return 0;\n}\n"));

        LANGS.put("C", new LangSpec(
                "C", "C", "Main.c",
                Arrays.asList("gcc", "-O2", "-o", "main.exe", "Main.c"),
                null, "main.exe", Collections.emptyList(),
                Arrays.asList("gcc", "--version"), "gcc",
                "#include <stdio.h>\n\nint main() {\n\n"
                        + "    // TODO 1：按题目要求读入数据\n\n"
                        + "    // TODO 2：在这里写你的算法\n\n"
                        + "    // TODO 3：输出结果\n\n"
                        + "    return 0;\n}\n"));

        LANGS.put("PYTHON", new LangSpec(
                "PYTHON", "Python", "Main.py",
                Arrays.asList("python", "-m", "py_compile", "Main.py"),
                "python", null, Arrays.asList("Main.py"),
                Arrays.asList("python", "--version"), "python",
                "import sys\n\n\ndef main():\n    data = sys.stdin.read().split()\n\n"
                        + "    # TODO 1：按题目要求读入数据\n\n"
                        + "    # TODO 2：在这里写你的算法\n\n"
                        + "    # TODO 3：输出结果\n\n\n"
                        + "if __name__ == \"__main__\":\n    main()\n"));

        LANGS.put("JAVASCRIPT", new LangSpec(
                "JAVASCRIPT", "JavaScript", "Main.js",
                Arrays.asList("node", "--check", "Main.js"),
                "node", null, Arrays.asList("Main.js"),
                Arrays.asList("node", "--version"), "v",
                "const data = require('fs').readFileSync(0, 'utf8').trim().split(/\\s+/);\n\n"
                        + "// TODO 1：按题目要求读入数据\n\n"
                        + "// TODO 2：在这里写你的算法\n\n"
                        + "// TODO 3：输出结果\n// console.log(ans);\n"));
    }

    // ------------------------------------------------------------------ 解释器定位
    // 解释型语言经常「装了，但没加进 PATH」——Anaconda 装的 Python 默认就不加，
    // 这样一来探测会把本来能跑的 Python 误判成"没装"。所以除了 PATH 上的命令，
    // 还去几个常见安装位置翻一翻，找到能用的那个绝对路径。

    /** 想手动指定就配 judge.python-path；留空则自动找 */
    @Value("${judge.python-path:}")
    private String pythonPath;

    private volatile boolean interpretersReady = false;

    /** 只做一次：把语言表里的 python 换成这台机器上真能用的那个 */
    private synchronized void ensureInterpreters() {
        if (interpretersReady) {
            return;
        }
        interpretersReady = true;
        String python = firstWorking(pythonCandidates(), "--version", "python");
        if (python == null || "python".equals(python)) {
            return;
        }
        LangSpec old = LANGS.get("PYTHON");
        LANGS.put("PYTHON", new LangSpec(old.key, old.label, old.sourceName,
                replaceExe(old.compileCmd, "python", python),
                python, old.localExe, old.runArgs,
                Arrays.asList(python, "--version"), old.probeExpect, old.template));
        log.info("判题机：Python 解释器用 {}", python);
    }

    private List<String> pythonCandidates() {
        List<String> list = new ArrayList<>();
        if (pythonPath != null && !pythonPath.trim().isEmpty()) {
            list.add(pythonPath.trim());
        }
        list.add("python");
        list.add("python3");
        list.add("py");                       // Windows 的 Python Launcher
        // 官方安装包和 conda 的常见落点
        list.add("C:/ProgramData/anaconda3/python.exe");
        list.add("C:/ProgramData/miniconda3/python.exe");
        String home = System.getProperty("user.home");
        list.add(home + "/anaconda3/python.exe");
        list.add(home + "/miniconda3/python.exe");
        list.add(home + "/AppData/Local/Programs/Python/Python313/python.exe");
        // 最后再扫一遍目录（版本号不好写死）
        list.addAll(scanPythonDirs("C:/"));
        list.addAll(scanPythonDirs("C:/Program Files"));
        list.addAll(scanPythonDirs(home + "/AppData/Local/Programs/Python"));
        return list;
    }

    private List<String> scanPythonDirs(String parent) {
        List<String> found = new ArrayList<>();
        File[] children = new File(parent).listFiles();
        if (children == null) {
            return found;
        }
        for (File child : children) {
            String name = child.getName();
            if (!child.isDirectory() || !name.toLowerCase().startsWith("python")) {
                continue;
            }
            File exe = new File(child, "python.exe");
            if (exe.isFile()) {
                found.add(exe.getAbsolutePath().replace('\\', '/'));
            }
        }
        return found;
    }

    /** 挑第一个真能跑起来的命令；Windows 应用商店那个占位壳会在这里被挡掉 */
    private String firstWorking(List<String> candidates, String arg, String expect) {
        for (String cmd : candidates) {
            if (cmd == null || cmd.trim().isEmpty()) {
                continue;
            }
            if (works(cmd, arg, expect)) {
                return cmd;
            }
        }
        return null;
    }

    private boolean works(String cmd, String arg, String expect) {
        Process process = null;
        try {
            ProcessBuilder builder = new ProcessBuilder(Arrays.asList(cmd, arg));
            builder.redirectErrorStream(true);
            process = builder.start();
            if (!process.waitFor(8, TimeUnit.SECONDS)) {
                process.destroyForcibly();
                return false;
            }
            String output = readStream(process.getInputStream());
            return process.exitValue() == 0 && output.toLowerCase().contains(expect.toLowerCase());
        } catch (Exception e) {
            return false;
        } finally {
            if (process != null && process.isAlive()) {
                process.destroyForcibly();
            }
        }
    }

    private static List<String> replaceExe(List<String> cmd, String from, String to) {
        List<String> out = new ArrayList<>();
        for (String item : cmd) {
            out.add(from.equals(item) ? to : item);
        }
        return out;
    }

    // ------------------------------------------------------------------ 语言可用性

    private volatile List<Map<String, Object>> languageCache;
    private volatile long languageCacheAt = 0L;

    /** 探测这台机器上哪些语言真能跑（缓存 60 秒，装了新工具链不用重启） */
    private List<Map<String, Object>> probeLanguages() {
        if (languageCache == null || System.currentTimeMillis() - languageCacheAt > 60_000L) {
            List<Map<String, Object>> list = new ArrayList<>();
            for (LangSpec spec : LANGS.values()) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("key", spec.key);
                item.put("label", spec.label);
                item.put("template", spec.template);
                String reason = probe(spec);
                item.put("available", reason == null);
                item.put("reason", reason);
                list.add(item);
            }
            languageCache = list;
            languageCacheAt = System.currentTimeMillis();
        }
        return languageCache;
    }

    /** @return null 表示可用；否则返回不可用的原因 */
    private String probe(LangSpec spec) {
        try {
            ProcessBuilder pb = new ProcessBuilder(spec.probeCmd);
            pb.redirectErrorStream(true);
            Process process = pb.start();
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line).append("\n");
                }
            }
            boolean finished = process.waitFor(5, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                return "探测超时";
            }
            String output = sb.toString();
            // ⚠️ Windows 上 `python` 可能是应用商店的占位壳：退出码非 0 且没有任何输出。
            //    所以「退出码为 0」和「有输出」两个条件都要满足，缺一不可。
            if (process.exitValue() != 0 || output.trim().isEmpty()) {
                return "命令不可用（可能未安装）";
            }
            if (!output.toLowerCase().contains(spec.probeExpect.toLowerCase())) {
                return "命令异常：" + output.trim().split("\n")[0];
            }
            return null;
        } catch (Exception e) {
            return "未安装或不在 PATH 中";
        }
    }

    @Override
    public List<Map<String, Object>> listLanguages() {
        ensureInterpreters();
        return probeLanguages();
    }

    // ------------------------------------------------------------------ 判题主流程

    @Override
    @Transactional
    public CompileResultVO compileAndJudge(Long userId, CompileDTO compileDTO) {
        ensureInterpreters();
        Problem problem = problemService.getById(compileDTO.getProblemId());
        if (problem == null) {
            return CompileResultVO.builder()
                    .status("ERROR")
                    .message("题目不存在")
                    .build();
        }

        LangSpec spec = LANGS.get(compileDTO.getLanguage() == null
                ? "JAVA" : compileDTO.getLanguage().toUpperCase());
        if (spec == null) {
            return CompileResultVO.builder()
                    .status("ERROR")
                    .message("判题机不支持这门语言：" + compileDTO.getLanguage()
                            + "，目前支持 " + String.join(" / ", LANGS.keySet()))
                    .build();
        }

        CompileResultVO result = compileAndRun(compileDTO.getCode(), spec,
                problem.getSampleInput(), problem.getSampleOutput());

        if (userId != null) {
            SubmitRecord record = new SubmitRecord();
            record.setUserId(userId);
            record.setProblemId(compileDTO.getProblemId());
            record.setCode(compileDTO.getCode());
            record.setLanguage(spec.key);
            record.setStatus(result.getStatus());
            record.setTimeUsed(result.getTimeUsed());
            record.setMemoryUsed(result.getMemoryUsed());
            record.setErrorMessage(result.getMessage());
            record.setOutput(result.getOutput());
            record.setExpectedOutput(result.getExpectedOutput());
            record.setCreateTime(java.time.LocalDateTime.now());
            submitRecordService.save(record);

            updateProblemCount(problem.getId(), result.getStatus());
            updateUserCount(userId, result.getStatus());
        }

        return result;
    }

    private CompileResultVO compileAndRun(String code, LangSpec spec, String sampleInput, String expectedOutput) {
        File root = new File(workDir);
        if (!root.exists() && !root.mkdirs()) {
            return CompileResultVO.builder()
                    .status("ERROR")
                    .message("判题工作目录创建失败：" + workDir)
                    .build();
        }
        // 每次判题单独开一个子目录：之前所有提交共用一个目录、固定文件名，
        // 两个提交同时判就会互相覆盖源文件/输出，甚至报「找不到文件: Main.java」。
        File dir = new File(root, "run_" + UUID.randomUUID().toString().replace("-", ""));
        if (!dir.mkdirs()) {
            return CompileResultVO.builder()
                    .status("ERROR")
                    .message("判题工作目录创建失败：" + dir.getAbsolutePath())
                    .build();
        }

        File sourceFile = new File(dir, spec.sourceName);
        try (OutputStreamWriter writer = new OutputStreamWriter(
                new FileOutputStream(sourceFile), StandardCharsets.UTF_8)) {
            writer.write(code);
        } catch (IOException e) {
            return CompileResultVO.builder()
                    .status("ERROR")
                    .message("代码文件创建失败：" + e.getMessage())
                    .build();
        }

        try {
            // 有编译/语法检查步骤的，先跑它；不过就直接返回 CE，不再浪费一次运行
            if (!spec.compileCmd.isEmpty()) {
                CompileResultVO compileResult = compile(dir, spec);
                if (!"ACCEPTED".equals(compileResult.getStatus())) {
                    return compileResult;
                }
            }
            return run(dir, spec, sampleInput, expectedOutput);
        } finally {
            cleanup(dir, spec);
            dir.delete();
        }
    }

    private CompileResultVO compile(File workDir, LangSpec spec) {
        ProcessBuilder processBuilder = new ProcessBuilder(spec.compileCmd);
        processBuilder.directory(workDir);

        try {
            Process process = processBuilder.start();

            StringBuilder errorOutput = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                String detail = errorOutput.toString().trim();
                if (detail.isEmpty()) {
                    // 工具链没装好时编译器往往一声不吭，只回一个非 0 退出码，
                    // 光显示「编译失败: 」等于没说 —— 补一句人话。
                    detail = spec.label + " 编译器没有任何输出，通常是工具链没装好（看语言下拉里的可用性提示）";
                }
                return CompileResultVO.builder()
                        .status("COMPILE_ERROR")
                        .message("编译失败: " + detail)
                        .build();
            }

            return CompileResultVO.builder()
                    .status("ACCEPTED")
                    .message("编译成功")
                    .build();

        } catch (Exception e) {
            log.error("编译异常", e);
            return CompileResultVO.builder()
                    .status("COMPILE_ERROR")
                    .message("编译异常: " + e.getMessage()
                            + "（" + spec.label + " 工具链可能没装，可在语言列表里看可用性）")
                    .build();
        }
    }

    /**
     * 运行子进程并获取其输出及内存使用。
     * <p>
     * 内存测量：父进程的 MemoryMXBean 测不到子进程（永远是 0）。所以：
     * Linux 用 /usr/bin/time -v 拿 Maximum resident set size；
     * Windows 用 PowerShell Start-Process 轮询子进程的 PeakWorkingSet64。
     */
    private CompileResultVO run(File workDir, LangSpec spec, String input, String expectedOutput) {
        String os = System.getProperty("os.name").toLowerCase();

        /* 运行程序：要么是 PATH 上的命令（java/python/node），要么是临时目录里刚生成的可执行文件。
           ⚠️ Windows 的 Start-Process **不会**在「当前目录」里找程序，所以本地可执行文件必须给绝对路径。 */
        String exe = spec.localExe != null
                ? new File(workDir, spec.localExe).getAbsolutePath()
                : spec.runExe;

        List<String> runArgs = new ArrayList<>(spec.runArgs);

        ProcessBuilder processBuilder;
        if (os.contains("windows")) {
            StringBuilder argList = new StringBuilder();
            for (String a : runArgs) {
                if (argList.length() > 0) {
                    argList.append(",");
                }
                argList.append("'").append(a.replace("'", "''")).append("'");
            }
            String argPart = argList.length() > 0 ? " -ArgumentList " + argList : "";
            processBuilder = new ProcessBuilder(
                    "powershell", "-NoProfile", "-Command",
                    "$prog = Start-Process -FilePath '" + exe + "'" + argPart +
                    " -PassThru -NoNewWindow -RedirectStandardOutput stdout.txt -RedirectStandardError stderr.txt; " +
                    "$peak=0; " +
                    "while(!$prog.HasExited) { " +
                    "  try { " +
                    "    $m=[Math]::Round((Get-Process -Id $prog.Id -ErrorAction Stop).PeakWorkingSet64 / 1KB); " +
                    "    if($m -gt $peak){$peak=$m} " +
                    "  } catch {} " +
                    "  Start-Sleep -Milliseconds 30 " +
                    "}; " +
                    "$prog.WaitForExit(); " +
                    "$output = (Get-Content stdout.txt -Raw); " +
                    "$err = (Get-Content stderr.txt -Raw); " +
                    "Remove-Item stdout.txt,stderr.txt -ErrorAction SilentlyContinue; " +
                    "Write-Host '===MEMPEAK==='; " +
                    "Write-Host $peak; " +
                    "Write-Host '===STDOUT==='; " +
                    "Write-Host $output; " +
                    "Write-Host '===STDERR==='; " +
                    "Write-Host $err; " +
                    "exit $prog.ExitCode"
            );
            processBuilder.directory(workDir);
        } else {
            List<String> cmd = new ArrayList<>();
            cmd.add("/usr/bin/time");
            cmd.add("-v");
            cmd.add(exe);
            cmd.addAll(runArgs);
            processBuilder = new ProcessBuilder(cmd);
            processBuilder.directory(workDir);
        }

        long startTime = System.currentTimeMillis();

        try {
            Process process = processBuilder.start();

            // 把题目样例喂给程序的标准输入
            try (BufferedWriter writer = new BufferedWriter(
                    new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8))) {
                if (input != null) {
                    writer.write(input);
                }
                writer.flush();
            }

            Future<String> outputFuture = executorService.submit(() -> readStream(process.getInputStream()));
            Future<String> errorFuture = executorService.submit(() -> readStream(process.getErrorStream()));

            boolean completed = process.waitFor(timeLimit, TimeUnit.MILLISECONDS);

            int memoryUsed = 0;
            String stdOutput = "";
            String stdError = "";

            if (os.contains("windows")) {
                // PowerShell 输出格式：===MEMPEAK=== / 数值 / ===STDOUT=== / 程序输出 / ===STDERR=== / 程序报错
                String combined = outputFuture.get();
                String[] parts = combined.split("===MEMPEAK===\n");
                if (parts.length >= 2) {
                    String[] rest = parts[1].split("===STDOUT===\n");
                    if (rest.length >= 1) {
                        try {
                            memoryUsed = Integer.parseInt(rest[0].trim());
                        } catch (NumberFormatException ignored) {
                            // 内存拿不到不影响判题
                        }
                    }
                    if (rest.length >= 2) {
                        String[] tail = rest[1].split("===STDERR===\n");
                        stdOutput = tail[0];
                        if (tail.length >= 2) {
                            stdError = tail[1];
                        }
                    }
                }
            } else {
                // Linux：time -v 把统计信息写在 stderr 里，得先把它摘出来
                String stderr = errorFuture.get();
                for (String line : stderr.split("\n")) {
                    if (line.contains("Maximum resident set size")) {
                        String[] parts = line.trim().split(":\\s+");
                        if (parts.length >= 2) {
                            try {
                                memoryUsed = Integer.parseInt(parts[1].trim().split("\\s+")[0]);
                            } catch (NumberFormatException ignored) {
                                // 同上
                            }
                        }
                    }
                }
                stdOutput = outputFuture.get();
                stdError = stderr;
            }

            if (!completed) {
                process.destroyForcibly();
                return CompileResultVO.builder()
                        .status("TIME_LIMIT_EXCEEDED")
                        .message("运行超时（限制 " + timeLimit + " ms）")
                        .timeUsed(timeLimit)
                        .memoryUsed(memoryUsed)
                        .expectedOutput(expectedOutput)
                        .build();
            }

            long endTime = System.currentTimeMillis();
            int timeUsed = (int) (endTime - startTime);

            int exitCode = process.exitValue();

            if (exitCode != 0) {
                String detail = stdError == null ? "" : stdError.trim();
                return CompileResultVO.builder()
                        .status("RUNTIME_ERROR")
                        .message("运行时错误，退出码: " + exitCode
                                + (detail.isEmpty() ? "" : "\n" + detail))
                        .timeUsed(timeUsed)
                        .memoryUsed(memoryUsed)
                        .output(stdOutput)
                        .expectedOutput(expectedOutput)
                        .build();
            }

            if (normalizeOutput(stdOutput).equals(normalizeOutput(expectedOutput))) {
                return CompileResultVO.builder()
                        .status("ACCEPTED")
                        .message("通过")
                        .output(stdOutput)
                        .expectedOutput(expectedOutput)
                        .timeUsed(timeUsed)
                        .memoryUsed(memoryUsed)
                        .build();
            }
            return CompileResultVO.builder()
                    .status("WRONG_ANSWER")
                    .message("答案错误")
                    .output(stdOutput)
                    .expectedOutput(expectedOutput)
                    .timeUsed(timeUsed)
                    .memoryUsed(memoryUsed)
                    .build();

        } catch (Exception e) {
            log.error("运行异常", e);
            return CompileResultVO.builder()
                    .status("RUNTIME_ERROR")
                    .message("运行异常: " + e.getMessage()
                            + "（" + spec.label + " 工具链可能没装，可在语言列表里看可用性）")
                    .expectedOutput(expectedOutput)
                    .build();
        }
    }

    private String readStream(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }

    private String normalizeOutput(String output) {
        if (output == null) {
            return "";
        }
        return output.trim().replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n");
    }

    /** 清掉这次判题留下的所有产物（源文件、可执行文件、临时输出、Python 缓存） */
    private void cleanup(File workDir, LangSpec spec) {
        List<String> names = new ArrayList<>(Arrays.asList(
                spec.sourceName, "main.exe", "main", "a.out", "stdout.txt", "stderr.txt"));
        if ("JAVA".equals(spec.key)) {
            names.add("Main.class");
        }
        for (String name : names) {
            File file = new File(workDir, name);
            if (file.exists()) {
                file.delete();
            }
        }
        File cache = new File(workDir, "__pycache__");
        if (cache.isDirectory()) {
            File[] files = cache.listFiles();
            if (files != null) {
                for (File file : files) {
                    file.delete();
                }
            }
            cache.delete();
        }
    }

    private void updateProblemCount(Long problemId, String status) {
        Problem problem = problemService.getById(problemId);
        problem.setSubmitCount(problem.getSubmitCount() + 1);
        if ("ACCEPTED".equals(status)) {
            problem.setAcceptCount(problem.getAcceptCount() + 1);
        }
        problemService.updateById(problem);
    }

    private void updateUserCount(Long userId, String status) {
        User user = userService.getById(userId);
        user.setTotalProblems(user.getTotalProblems() + 1);
        if ("ACCEPTED".equals(status)) {
            user.setAcceptedProblems(user.getAcceptedProblems() + 1);
        }
        userService.updateById(user);
    }

}

"""Start the original map lobby and its four optional NPC services on one PC.

This is a local development launcher.  Only the lobby listens on the LAN.
Press Ctrl+C to stop only processes started by this launcher.
"""

from __future__ import annotations

import argparse
import os
import shutil
import socket
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MP = ROOT / "mp"
LOGS = MP / "runlogs"
MYSQL_DATA = MP / "mysql-dev"
MYSQL_PASS = MP / "mysql-pass"
MYSQL_PORT = 3307
CREATE_FLAGS = getattr(subprocess, "CREATE_NO_WINDOW", 0)


def port_open(port: int) -> bool:
    try:
        with socket.create_connection(("127.0.0.1", port), timeout=0.3):
            return True
    except OSError:
        return False


def wait_port(port: int, timeout: float) -> bool:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if port_open(port):
            return True
        time.sleep(0.25)
    return port_open(port)


def status(message: str) -> None:
    print(message, flush=True)


def program(name: str) -> str | None:
    return shutil.which(name)


def mysql_program() -> str | None:
    found = program("mysqld.exe") or program("mysqld")
    known = Path(r"D:\mysql\mysql-9.3.0-winx64\bin\mysqld.exe")
    return found or (str(known) if known.is_file() else None)


def supports_xbg(python: str) -> bool:
    try:
        result = subprocess.run(
            [python, "-c", "import sys;sys.exit(sys.version_info < (3, 12))"],
            stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            timeout=5, creationflags=CREATE_FLAGS, check=False,
        )
        return result.returncode == 0
    except (OSError, subprocess.TimeoutExpired):
        return False


def xbg_python() -> str | None:
    venv = ROOT / "xueba-ge/.venv/Scripts/python.exe"
    if venv.is_file() and supports_xbg(str(venv)):
        return str(venv)
    if sys.version_info >= (3, 12):
        return sys.executable
    launcher = program("py.exe") or program("py")
    if launcher:
        try:
            result = subprocess.run(
                [launcher, "-3.13", "-c", "import sys;print(sys.executable)"],
                stdin=subprocess.DEVNULL, capture_output=True, text=True,
                timeout=5, creationflags=CREATE_FLAGS, check=False,
            )
            candidate = Path(result.stdout.strip())
            if result.returncode == 0 and candidate.is_file() and supports_xbg(str(candidate)):
                return str(candidate)
        except (OSError, subprocess.TimeoutExpired):
            pass
    return None


def ready_report() -> None:
    """Read-only preflight, useful before changing any running processes."""
    checks = [
        ("大厅 Python", Path(sys.executable).is_file()),
        ("大厅 websockets", module_available("websockets")),
        ("保安服务与 FastAPI", (ROOT / "laoding/server/app.py").is_file() and module_available("fastapi")),
        ("学霸姐索引", (ROOT / "xueba-ge/kb/index/doc_vecs.f32").exists()),
        ("学霸姐 Python 3.12+", bool(xbg_python())),
        ("食堂阿姨 uvicorn", module_available("uvicorn")),
        ("算法哥隔离数据库", (MYSQL_DATA / "mysql.ibd").is_file()),
        ("算法哥 MySQL 程序", bool(mysql_program())),
        ("算法哥密码文件", MYSQL_PASS.is_file()),
        ("算法哥 Maven", bool(program("mvn.cmd") or program("mvn"))),
        ("算法哥 Java", bool(program("java"))),
        ("算法哥 Vite", (ROOT / "campus_game/frontend/node_modules/vite/bin/vite.js").is_file()),
    ]
    for label, okay in checks:
        status(f"{'[可用]' if okay else '[缺失]'} {label}")
    for port in (3000, 8090, 8000, 8010, 8020, MYSQL_PORT, 8081, 3001):
        status(f"端口 {port}: {'已监听' if port_open(port) else '空闲'}")


def module_available(name: str) -> bool:
    try:
        __import__(name)
        return True
    except ImportError:
        return False


class Launcher:
    def __init__(self) -> None:
        self.children: list[tuple[str, subprocess.Popen, object]] = []
        LOGS.mkdir(parents=True, exist_ok=True)

    def start(
        self,
        name: str,
        port: int,
        args: list[str],
        cwd: Path,
        env: dict[str, str] | None = None,
        timeout: float = 12,
    ) -> bool:
        if port_open(port):
            status(f"[已运行] {name}：127.0.0.1:{port}，保留现有进程")
            return True
        log_path = LOGS / f"{name}.log"
        log = log_path.open("a", encoding="utf-8")
        log.write(f"\n===== launcher {time.strftime('%Y-%m-%d %H:%M:%S')} =====\n")
        log.flush()
        try:
            child = subprocess.Popen(
                args,
                cwd=str(cwd),
                env=env,
                stdin=subprocess.DEVNULL,
                stdout=log,
                stderr=subprocess.STDOUT,
                creationflags=CREATE_FLAGS,
            )
        except OSError as exc:
            log.close()
            status(f"[未启动] {name}：{exc}；大厅可继续使用")
            return False
        self.children.append((name, child, log))
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if port_open(port):
                status(f"[就绪] {name}：127.0.0.1:{port}")
                return True
            if child.poll() is not None:
                status(f"[未启动] {name}：进程退出（代码 {child.returncode}），见 {log_path}")
                return False
            time.sleep(0.25)
        status(f"[启动中] {name}：暂未监听 {port}，稍后可查看 {log_path}")
        return False

    def build_agent(self) -> bool:
        backend = ROOT / "campus_game/backend"
        jar = backend / "target/coding-platform-1.0.0.jar"
        sources = [backend / "pom.xml", *backend.glob("src/main/**/*.java"), *backend.glob("src/main/**/*.yml")]
        latest_source = max((p.stat().st_mtime for p in sources if p.is_file()), default=0)
        if jar.is_file() and jar.stat().st_mtime >= latest_source:
            return True
        mvn = program("mvn.cmd") or program("mvn")
        if not mvn:
            status("[未启动] 算法哥后端：源码比 Java 包新，且未找到 Maven；大厅可继续使用")
            return False
        log_path = LOGS / "算法哥构建.log"
        status("[构建] 算法哥后端：使用本机 Maven 和已有依赖编译更新后的源码…")
        with log_path.open("a", encoding="utf-8") as log:
            log.write(f"\n===== launcher {time.strftime('%Y-%m-%d %H:%M:%S')} =====\n")
            log.flush()
            try:
                result = subprocess.run(
                    [mvn, "-o", "-q", "-DskipTests", "package"],
                    cwd=str(backend),
                    stdin=subprocess.DEVNULL,
                    stdout=log,
                    stderr=subprocess.STDOUT,
                    timeout=300,
                    creationflags=CREATE_FLAGS,
                    check=False,
                )
            except (OSError, subprocess.TimeoutExpired) as exc:
                status(f"[未启动] 算法哥后端：构建失败（{type(exc).__name__}），见 {log_path}")
                return False
        if result.returncode != 0 or not jar.is_file():
            status(f"[未启动] 算法哥后端：本地 Maven 构建失败，见 {log_path}")
            return False
        status("[就绪] 算法哥后端 Java 包已更新")
        return True

    def start_mysql(self) -> bool:
        if port_open(MYSQL_PORT):
            status("[已运行] 算法哥隔离 MySQL：127.0.0.1:3307")
            return True
        if not (MYSQL_DATA / "mysql.ibd").is_file():
            status("[未启动] 算法哥隔离 MySQL：mp/mysql-dev 尚未初始化；大厅可继续使用")
            return False
        mysqld = mysql_program()
        if not mysqld:
            status("[未启动] 算法哥隔离 MySQL：未找到 mysqld；大厅可继续使用")
            return False
        return self.start(
            "算法哥隔离MySQL", MYSQL_PORT,
            [mysqld, "--no-defaults", f"--datadir={MYSQL_DATA}", "--port=3307",
             "--bind-address=127.0.0.1", "--mysqlx=OFF", "--console"],
            ROOT, timeout=20,
        )

    def start_npcs(self) -> None:
        guard = ROOT / "laoding"
        if (guard / "server/app.py").is_file() and module_available("fastapi"):
            # The bundled server_vendor contains no pydantic_core binary for
            # this machine. The already installed FastAPI imports correctly.
            self.start("保安老丁", 8000, [sys.executable, "server/app.py"], guard)
        else:
            status("[未启动] 保安老丁：缺少服务文件或当前 Python 的 FastAPI；大厅可继续使用")

        scholar = ROOT / "xueba-ge"
        scholar_python = xbg_python()
        if not (scholar / "kb/index/doc_vecs.f32").is_file():
            status("[未启动] 学霸姐：缺少知识索引，按 xueba-ge/DEPLOY.md 构建；大厅可继续使用")
        elif not scholar_python:
            status("[未启动] 学霸姐：原项目需要 Python 3.12+；大厅可继续使用")
        else:
            xbg_env = os.environ.copy()
            xbg_env.update(PYTHONUTF8="1", PYTHONIOENCODING="utf-8", NO_PROXY="127.0.0.1,localhost")
            xbg_env["XBG_LOCAL_MODE"] = "1"
            xbg_env["PYTHONPATH"] = os.pathsep.join(
                [str(scholar / ".localdeps"), xbg_env.get("PYTHONPATH", "")]
            )
            self.start(
                "学霸姐", 8010,
                [scholar_python, "-m", "uvicorn", "backend.app:app",
                 "--host", "127.0.0.1", "--port", "8010"],
                scholar, xbg_env, timeout=20,
            )

        aunt = ROOT / "campus_game_cmr"
        if module_available("uvicorn") and (aunt / "aunt/server.py").is_file():
            self.start(
                "食堂阿姨", 8020,
                [sys.executable, "-m", "uvicorn", "aunt.server:app", "--host", "127.0.0.1", "--port", "8020"],
                aunt,
            )
        else:
            status("[未启动] 食堂阿姨：缺少服务文件或 uvicorn；大厅可继续使用")

        backend_ready = port_open(8081)
        if backend_ready:
            status("[已运行] 算法哥后端：127.0.0.1:8081，保留现有进程")
        elif self.start_mysql():
            if not MYSQL_PASS.is_file():
                status("[未启动] 算法哥后端：缺少 mp/mysql-pass；大厅可继续使用")
            elif not program("java") or not self.build_agent():
                status("[未启动] 算法哥后端：缺少 Java 或本地构建未通过；大厅可继续使用")
            else:
                secret = MYSQL_PASS.read_text(encoding="utf-8").strip()
                if not secret:
                    status("[未启动] 算法哥后端：mp/mysql-pass 为空；大厅可继续使用")
                else:
                    backend_env = os.environ.copy()
                    backend_env["SPRING_DATASOURCE_URL"] = (
                        "jdbc:mysql://127.0.0.1:3307/coding_platform?useUnicode=true"
                        "&characterEncoding=utf8&serverTimezone=Asia/Shanghai&useSSL=false"
                        "&allowPublicKeyRetrieval=true"
                    )
                    backend_env["SPRING_DATASOURCE_USERNAME"] = "root"
                    backend_env["SPRING_DATASOURCE_PASSWORD"] = secret
                    backend_ready = self.start(
                        "算法哥后端", 8081,
                        [program("java"), "-jar", str(ROOT / "campus_game/backend/target/coding-platform-1.0.0.jar"),
                         "--server.address=127.0.0.1", "--agent.llm.api-key="],
                        ROOT / "campus_game/backend", backend_env, timeout=35,
                    )
        if not backend_ready:
            status("[未启动] 算法哥前端：等待原后端 8081 就绪；大厅可继续使用")
            return
        vite = ROOT / "campus_game/frontend/node_modules/vite/bin/vite.js"
        node = program("node")
        if node and vite.is_file():
            self.start(
                "算法哥前端", 3001,
                [node, str(vite), "--host", "127.0.0.1", "--port", "3001", "--strictPort"],
                ROOT / "campus_game/frontend", timeout=20,
            )
        else:
            status("[未启动] 算法哥前端：缺少 Node 或原项目 Vite 依赖；大厅可继续使用")

    def stop(self) -> None:
        for name, child, log in reversed(self.children):
            if child.poll() is None:
                status(f"[停止] {name}")
                try:
                    if os.name == "nt":
                        subprocess.run(
                            ["taskkill", "/PID", str(child.pid), "/T", "/F"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                            creationflags=CREATE_FLAGS, timeout=8, check=False,
                        )
                    else:
                        child.terminate()
                        child.wait(timeout=8)
                except (OSError, subprocess.TimeoutExpired):
                    child.kill()
            log.close()


def main() -> int:
    if os.name == "nt" and hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="原地图联机大厅与本机 NPC 一键启动")
    parser.add_argument("--check", action="store_true", help="只检查依赖和端口，不启动进程")
    parser.add_argument("--open", action="store_true", help="大厅就绪时打开浏览器")
    args = parser.parse_args()
    if args.check:
        ready_report()
        return 0
    if not module_available("websockets"):
        status("[错误] 大厅缺少 websockets，请为当前 Python 安装 websockets>=15")
        return 1
    launcher = Launcher()
    try:
        if port_open(3000) != port_open(8090):
            status("[错误] 大厅 3000/8090 仅有一个端口被占用，请检查现有进程")
            return 1
        if not launcher.start(
            "原地图联机大厅", 3000, [sys.executable, "-u", "mp/server.py"], ROOT, timeout=12,
        ):
            return 1
        if not wait_port(8090, 8):
            status("[错误] 大厅网页已监听，但联机端口 8090 未就绪；请查看大厅日志")
            return 1
        status("大厅入口：http://localhost:3000/ （局域网电脑改用本机 IPv4 地址）")
        if args.open:
            webbrowser.open("http://localhost:3000/")
        launcher.start_npcs()
        status("启动流程完成。按 Ctrl+C 停止由此脚本启动的服务。")
        exited: set[int] = set()
        while True:
            time.sleep(2)
            for name, child, _ in launcher.children:
                if child.poll() is not None and child.pid not in exited:
                    status(f"[已退出] {name}：代码 {child.returncode}，可查看 mp/runlogs/{name}.log")
                    exited.add(child.pid)
    except KeyboardInterrupt:
        status("正在停止本次启动的服务…")
    finally:
        launcher.stop()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

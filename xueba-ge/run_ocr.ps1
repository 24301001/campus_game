# 学霸哥 · 扫描版教材 OCR 跑手（MinerU 4.0，本地推理，不上传云端）
#
#   .\run_ocr.ps1                                  # 跑上册
#   .\run_ocr.ps1 -Pdf "E:\...\微积分下册-第2版(1).pdf" -BookId xbg-calc2 -Book "微积分(下册·第2版)"
#   .\run_ocr.ps1 -Force                           # 忽略已完成的批次，全部重跑
#
# 为什么分批：这台机器可用提交内存只有 ~4.3 GB，一把梭 330 页会撞 onnxruntime
# 的 `bad allocation`。实测 8.37 秒/页，55 页一批约 7.7 分钟，跑完能续。
# 产物：教材\middle\<BookId>_bNN.json（中间）→ 教材\<BookId>.md（语料）→ 复制到 kb\sources\
#
# 真题也归它管（2026-09-21 实测：8 份算法卷 60 页共 5.5 分钟，368 个公式乱码全清）。
# Word 导出的卷子用的是 Symbol / Wingdings / Cambria Math 字体，文字层直抽会把
# ≤ ≥ × ∈ ①{ } 抽成 U+F0xx 乱码，所以真题**必须**带 -OcrMode ocr：
#   .\run_ocr.ps1 -Pdf "E:\...\试卷\算法设计与分析\2023-2024-2-A.pdf" -BookId alg23242a `
#       -Course 算法设计与分析 -Book "算法设计与分析 2023—2024学年第2学期期末试卷(A卷)" `
#       -Source past_paper -OcrMode ocr -KeepImageAnalysis -Force
# 默认 auto 的那次实测残留 38/141（27%）乱码——别省这个参数。
param(
    [string]$Pdf    = 'E:\项目\第五学期\软测\教材\微积分上册-第2版.pdf',
    [string]$BookId = 'xbg-calc1',
    [string]$Course = '高等数学',
    [string]$Book   = '微积分(上册·第2版)',
    [string]$Source = 'textbook',
    [int]$Batch     = 55,
    # auto：MinerU 自己定。有真文字层的页它会直接抄文字层——扫描教材没问题（那层是假的，
    #       它认得出来），真题会栽在这上面：实测答案卷残留 38 个 U+F0xx 私用区乱码。
    # ocr ：强制逐字识别。真题必须用这个。
    [string]$OcrMode = 'auto',
    [switch]$KeepImageAnalysis,
    [switch]$Force
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:PYTHONIOENCODING = 'utf-8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$kit  = 'E:\17272\PDF tools for it\.venv\Scripts\mineru-kit.exe'
$py   = '.\.venv\Scripts\python.exe'
$mineruExe = 'E:\17272\PDF tools for it\.venv\Scripts\mineru.exe'
if (-not (Test-Path -LiteralPath $kit)) { Write-Host "[X] 没找到 MinerU：$kit" -ForegroundColor Red; exit 1 }
if (-not (Test-Path -LiteralPath $Pdf)) { Write-Host "[X] 没找到 PDF：$Pdf" -ForegroundColor Red; exit 1 }

$dir   = Split-Path -Parent $Pdf
$mid   = Join-Path $dir 'middle'
New-Item -ItemType Directory -Path $mid -Force | Out-Null

# doclib 常驻服务会预加载模型吃掉 1.7 GB，而 mineru-kit parse 不需要它
& $mineruExe server stop 2>$null | Out-Null

$n = (& $py -c "import pdfplumber,sys;print(len(pdfplumber.open(sys.argv[1]).pages))" $Pdf)
[int]$n = $n
Write-Host "[i] $BookId  共 $n 页，按 $Batch 页分批 = $([int][math]::Ceiling($n/$Batch)) 批" -ForegroundColor Cyan

$done = 0
for ($s = 1; $s -le $n; $s += $Batch) {
    $e = [math]::Min($s + $Batch - 1, $n)
    $tag = 'b{0:D2}' -f [int][math]::Floor($s / $Batch)
    $out = Join-Path $mid ("{0}_{1}.json" -f $BookId, $tag)
    if ((Test-Path -LiteralPath $out) -and -not $Force) { Write-Host "  [skip] $tag  $s-$e" ; $done++; continue }
    $sw = [Diagnostics.Stopwatch]::StartNew()
    Write-Host "  [run ] $tag  $s-$e ..." -NoNewline
    # MinerU 会往 stderr 写无害警告（超星 PDF 的 XMP 元数据不合法），
    # 而 ErrorActionPreference=Stop 会把 stderr 变成终止错误。这里临时降级并落日志。
    $ErrorActionPreference = 'Continue'
    $ia = @()
    if (-not $KeepImageAnalysis) { $ia = @('--disable-image-analysis') }
    & $kit parse $Pdf -p "$s-$e" --tier basic --ocr-mode $OcrMode @ia `
        --format middle_json -o $out *> "$mid\$BookId$tag.log"
    $rc = $LASTEXITCODE
    $ErrorActionPreference = 'Stop'
    $sw.Stop()
    if ((Test-Path -LiteralPath $out) -and $rc -eq 0) {
        $per = $sw.Elapsed.TotalSeconds / ($e - $s + 1)
        Write-Host (" {0:N0}s  ({1:N2} 秒/页)" -f $sw.Elapsed.TotalSeconds, $per) -ForegroundColor Green
    } else {
        Write-Host " 失败（多半是内存不够，关掉些程序后重跑本脚本，已完成的批次会跳过）" -ForegroundColor Yellow
        exit 2
    }
}

# 必须包 @()：只有一批时 Get-ChildItem 会吐**单个字符串**，@jobs 展开成字符，
# middle2md 收到的第一个参数就成了盘符 'E' -> FileNotFoundError。教材 6 批所以从没暴露，
# 真题这种一页到十几页的（单批）必踩。2026-09-21 实测。
$jobs = @(Get-ChildItem $mid -Filter "${BookId}_b*.json" | Sort-Object Name | ForEach-Object { $_.FullName })
Write-Host "[i] 合并 $($jobs.Count) 个批次 → markdown" -ForegroundColor Cyan
& $py -m kb.middle2md @jobs -o (Join-Path $dir "$BookId.md") --course $Course --book $Book --book-id $BookId --source-type $Source --ocr-note "MinerU 4.0 (ocr-mode=$OcrMode)"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

New-Item -ItemType Directory -Path '.\kb\sources' -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $dir "$BookId.md") -Destination '.\kb\sources\' -Force
Write-Host "[✓] 语料已就位：$dir\$BookId.md（并已复制到 kb\sources\）" -ForegroundColor Green
Write-Host "    下一步：编辑 config\corpus.json 加一行，然后 .\run.ps1 -Rebuild" -ForegroundColor Green
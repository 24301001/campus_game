# 无头浏览器跑一遍端上 embedding 自检页，再把浏览器那份向量交给排序对照脚本。
#
#   powershell -File tools/run_onnx_page.ps1                     # 默认 8010、试 WebGPU
#   powershell -File tools/run_onnx_page.ps1 -NoGpu              # 只量 wasm（同一个后端做 A/B）
#   powershell -File tools/run_onnx_page.ps1 -Url http://127.0.0.1:8011
#
# 前提：.\run.ps1 已经起着服务（页面要本站的 /static 和 /models 两条 mount）。
# 注意 ms 这一列在 --virtual-time-budget 下不准（虚拟时间会跳过墙钟），
# 要量真实延迟就直接在桌面浏览器里开 /static/onnx.html 看。
param(
  [string]$Url = 'http://127.0.0.1:8010',
  [string]$Index = 'kb\index_onnx',
  [switch]$NoGpu,
  [string]$Model = ''          # 换权重：model.onnx 是 fp32（对照 int8 用）
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$py = '.\.venv\Scripts\python.exe'
$edge = @('C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
          'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
          'C:\Program Files\Google\Chrome\Application\chrome.exe') |
        Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) {
  Write-Host '[X] 这台机器上找不到 Edge/Chrome。直接在浏览器里打开 ' "$Url/static/onnx.html"
  exit 2
}
# 每次都换新 profile：无头浏览器会缓存 .mjs，改完代码不换新目录看到的是**旧文件**（踩过）
$prof = Join-Path $env:TEMP ('xbg-edge-' + [guid]::NewGuid().ToString('N'))
$flags = @('--headless=new', '--no-first-run', '--disable-extensions', "--user-data-dir=$prof",
           '--allow-running-insecure-content', '--timeout=240000', '--virtual-time-budget=200000',
           '--dump-dom', "$Url/static/onnx.html$(if ($Model) { "?model=$Model" })")
if (-not $NoGpu) { $flags = @('--enable-unsafe-webgpu') + $flags }
Write-Host "浏览器 $edge"
Write-Host "页面   $Url/static/onnx.html  (WebGPU 标志 $(if ($NoGpu) { '关' } else { '开' }))`n"
# 用临时文件接 stdout：这台机器上 `& msedge` 的变量捕获拿到的是空的，
# 只有重定向到文件才收得到 --dump-dom 的输出（Edge 的 stdout 不走 PowerShell 管道）。
$domFile = Join-Path $env:TEMP 'xbg-onnx-dom.html'
# Edge 会往 stderr 写一堆无关噪音（这台机器上是一条 LoadEnclaveImageW），
# $ErrorActionPreference='Stop' 会把原生命令的 stderr 当成异常中断整个脚本 —— 这里临时放行。
$ErrorActionPreference = 'Continue'
& $edge @flags 2>&1 | Out-File -Encoding UTF8 $domFile
$ErrorActionPreference = 'Stop'
$dom = if (Test-Path $domFile) { Get-Content -Raw -Encoding UTF8 $domFile } else { '' }
$out = [regex]::Match($dom, '(?s)<pre id="out">(.*?)</pre>')
if (-not $out.Success) { Write-Host '[X] 页面没输出，DOM 尾部：' ($dom -replace '(?s)^.*</body>', '' -replace '(?s)</html>.*', ''); exit 1 }
($out.Groups[1].Value -split "`n") | Where-Object { $_ -match '^(UA |crossOriginIsolated|backend=|LOAD-FAIL|ERR |COS |WORST )' } | ForEach-Object { Write-Host $_ }
$vecs = [regex]::Match($dom, '(?s)<script type="application/json" id="vecs">(.*?)</script>')
if ($vecs.Success) {
  New-Item -ItemType Directory -Force -Path .tmp | Out-Null
  [System.IO.File]::WriteAllText("$PWD\.tmp\browser_vecs.json", $vecs.Groups[1].Value, (New-Object System.Text.UTF8Encoding $false))
  Write-Host "`n浏览器向量已落到 .tmp\browser_vecs.json，开始排序对照：" -ForegroundColor Cyan
  & $py tools\xbg_onnx_parity.py .tmp\browser_vecs.json $Index
  exit $LASTEXITCODE
}
Write-Host '`n[X] 页面没交出向量（多半是没跑完就被虚拟时间掐了）'
exit 1
# 学霸哥 · 一键起（开发）
#   .\run.ps1            建索引 + 起服务，然后浏览器打开 http://127.0.0.1:8010
#   .\run.ps1 -Rebuild   加了课本之后重建索引再起
#   .\run.ps1 -NoBuild   跳过建索引
param(
    [switch]$Rebuild, [switch]$NoBuild, [int]$Port = 8010,
    [string]$LlmKeyEnv = ""            # 有 Key 时传进来，会顺手把 provider 切成 api
)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$py = ".\.venv\Scripts\python.exe"
if (-not (Test-Path $py)) {
    Write-Host "[!] 没有 .venv，先建一个（C 盘满的话先把 TMP 指到别处）：" -ForegroundColor Yellow
    Write-Host "    python -m venv .venv; .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
    exit 1
}
$env:PYTHONIOENCODING = "utf-8"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

if (-not $NoBuild) {
    if ($Rebuild -or -not (Test-Path "kb\index\chunks.jsonl")) {
        Write-Host "[1/2] 建索引 …" -ForegroundColor Cyan
        & $py -m kb.load_campus 2>$null | Out-Null
        & $py -m kb.build
    }
}
if ($LlmKeyEnv) { & $py -c "import json,os;p='config/llm.json';d=json.load(open(p,encoding='utf-8'));d['provider']='api';d['key_env']='$LlmKeyEnv';json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2);print('[ok] llm.provider=api key_env=$LlmKeyEnv')" }
Write-Host "[2/2] 起服务 → http://127.0.0.1:$Port" -ForegroundColor Cyan
& $py -m uvicorn backend.app:app --host 127.0.0.1 --port $Port
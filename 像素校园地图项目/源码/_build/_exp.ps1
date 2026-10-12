$ErrorActionPreference="Stop"
$src=Join-Path $env:TEMP "xysrc.pptx"
$out="D:\desktop\ppexp"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$ppt=New-Object -ComObject PowerPoint.Application
$pres=$ppt.Presentations.Open($src,$true,$false,$false)
foreach($i in 1..5){
  $pres.Slides.Item($i).Export((Join-Path $out "_pp$i.png"),"PNG",1800,1012)
}
$pres.Close()
$ppt.Quit()
Write-Output "EXPORT OK"

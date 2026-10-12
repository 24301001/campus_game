Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile((Join-Path $PSScriptRoot '_map_render.png'))
$W = $bmp.Width
$SX = $W / 13.3333333333
Write-Host "W=$W SX=$SX"
function PX([double]$inchX, [double]$inchY) {
  $x = [int][Math]::Round($inchX * $SX)
  return $bmp.GetPixel($x, 970)
}
Write-Host ("direct 1140 -> " + ('{0:X2}' -f $bmp.GetPixel(1140, 970).R))
Write-Host ("PX 6.334 -> " + ('{0:X2}{1:X2}{2:X2}' -f (PX 6.3342 5.3917).R, (PX 6.3342 5.3917).G, (PX 6.3342 5.3917).B))
Write-Host ("PX 4.80 -> " + ('{0:X2}{1:X2}{2:X2}' -f (PX 4.8066 5.3917).R, (PX 4.8066 5.3917).G, (PX 4.8066 5.3917).B))
$bmp.Dispose()

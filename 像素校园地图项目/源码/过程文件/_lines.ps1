Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$OUT = [System.IO.StreamWriter]::new((Join-Path $root '_lines_dump.txt'), $false, [System.Text.UTF8Encoding]::new($false))
function W2 { param($o) $OUT.WriteLine([string]$o) }

$bmp = [System.Drawing.Bitmap]::FromFile((Join-Path $root '_map_render.png'))
$W = $bmp.Width
$H = $bmp.Height
$rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
$data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$stride = $data.Stride
$buf = New-Object byte[] ($stride * $H)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $buf, 0, $buf.Length)
$bmp.UnlockBits($data)

function IsBlack([int]$x, [int]$y) {
  $i = $y * $stride + $x * 3
  $b = $buf[$i]; $g = $buf[$i + 1]; $r = $buf[$i + 2]
  $mx = [Math]::Max($r, [Math]::Max($g, $b))
  $mn = [Math]::Min($r, [Math]::Min($g, $b))
  if ($mx -lt 120 -and ($mx - $mn) -lt 40) { return $true }
  return $false
}

$MINRUN = 24
W2 "=== HORIZONTAL BLACK RUNS (len >= $MINRUN px), y in inch ==="
for ($y = 0; $y -lt $H; $y += 3) {
  $runs = @()
  $x = 0
  while ($x -lt $W) {
    if (IsBlack $x $y) {
      $st = $x
      while ($x -lt $W -and (IsBlack $x $y)) { $x++ }
      if (($x - $st) -ge $MINRUN) { $runs += ("{0:N2}-{1:N2}" -f ($st / 180.0), ($x / 180.0)) }
    } else { $x++ }
  }
  if ($runs.Count -gt 0) { W2 ("y={0:N4}  {1}" -f ($y / 180.0), ($runs -join '  ')) }
}

W2 ""
W2 "=== VERTICAL BLACK RUNS (len >= $MINRUN px), x in inch ==="
for ($x = 0; $x -lt $W; $x += 3) {
  $runs = @()
  $y = 0
  while ($y -lt $H) {
    if (IsBlack $x $y) {
      $st = $y
      while ($y -lt $H -and (IsBlack $x $y)) { $y++ }
      if (($y - $st) -ge $MINRUN) { $runs += ("{0:N2}-{1:N2}" -f ($st / 180.0), ($y / 180.0)) }
    } else { $y++ }
  }
  if ($runs.Count -gt 0) { W2 ("x={0:N4}  {1}" -f ($x / 180.0), ($runs -join '  ')) }
}

W2 ""
W2 "=== BLACK DENSITY PER 30x30 BLOCK (count >= 60) ==="
for ($by = 0; $by -lt $H; $by += 30) {
  for ($bx = 0; $bx -lt $W; $bx += 30) {
    $n = 0
    for ($y = $by; $y -lt [Math]::Min($by + 30, $H); $y += 2) {
      for ($x = $bx; $x -lt [Math]::Min($bx + 30, $W); $x += 2) {
        if (IsBlack $x $y) { $n++ }
      }
    }
    if ($n -ge 60) { W2 ("block x={0:N2} y={1:N2} n={2}" -f ($bx / 180.0), ($by / 180.0), $n) }
  }
}
$OUT.Flush()
$OUT.Close()

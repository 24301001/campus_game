Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$OUT = [System.IO.StreamWriter]::new((Join-Path $root '_map_dump.txt'), $false, [System.Text.UTF8Encoding]::new($false))
function W2 { param($o) $OUT.WriteLine([string]$o) }

$bmp = [System.Drawing.Bitmap]::FromFile((Join-Path $root '_map_render.png'))
$W = $bmp.Width
$H = $bmp.Height
W2 "RENDER ${W}x${H}"

# slide is 13.3333 x 7.5 inch
$PPX = $W / 13.3333333333
$PPY = $H / 7.5
W2 ("PPX=" + $PPX + " PPY=" + $PPY)

function PixAt([double]$inchX, [double]$inchY) {
  $ix = [int][Math]::Round($inchX * $PPX)
  $iy = [int][Math]::Round($inchY * $PPY)
  if ($ix -lt 0) { $ix = 0 }
  if ($iy -lt 0) { $iy = 0 }
  if ($ix -ge $W) { $ix = $W - 1 }
  if ($iy -ge $H) { $iy = $H - 1 }
  return $bmp.GetPixel($ix, $iy)
}

function Classify($q) {
  $mx = [Math]::Max($q.R, [Math]::Max($q.G, $q.B))
  $mn = [Math]::Min($q.R, [Math]::Min($q.G, $q.B))
  $sat = $mx - $mn
  if ($mx -ge 248 -and $sat -lt 8) { return 'white' }
  if ($sat -lt 30) {
    if ($mx -lt 140) { return 'black' }
    return 'gray'
  }
  if ($q.R -gt $q.G -and $q.R -gt $q.B) { return 'red' }
  if ($q.G -gt $q.R -and $q.G -gt $q.B) { return 'green' }
  if ($q.B -ge $q.R -and $q.B -ge $q.G) { return 'blue' }
  return 'other'
}

$shapes = [System.IO.File]::ReadAllText((Join-Path $root '_shapes.json'), [System.Text.Encoding]::UTF8) | ConvertFrom-Json
W2 "=== SHAPE MAJORITY COLOR ==="
foreach ($s in $shapes) {
  if ($s.kind -ne 'sp') { continue }
  $tally = @{}
  for ($gi = 0; $gi -lt 6; $gi++) {
    for ($gj = 0; $gj -lt 6; $gj++) {
      $fx = 0.12 + 0.76 * ($gi / 5.0)
      $fy = 0.12 + 0.76 * ($gj / 5.0)
      $cls = Classify (PixAt ($s.x + $s.w * $fx) ($s.y + $s.h * $fy))
      if ($tally.ContainsKey($cls)) { $tally[$cls]++ } else { $tally[$cls] = 1 }
    }
  }
  $best = ($tally.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1)
  $txt = ''
  if ($s.text) { $txt = $s.text }
  W2 ("#{0} {1} xml={2} maj={3}({4}) x={5} y={6} w={7} h={8}  {9}" -f `
      $s.i, $s.kind, $s.fill, $best.Key, $best.Value, $s.x, $s.y, $s.w, $s.h, $txt)
}

# ---------- class map ----------
$COLS = 190
$ROWS = 106
W2 "=== CLASS MAP ==="
W2 ('    ' + ((0..($COLS - 1)) | ForEach-Object { if ($_ % 10 -eq 0) { [string]([int]($_ / 10) % 10) } else { ' ' } }) -join '')
for ($r = 0; $r -lt $ROWS; $r++) {
  $line = New-Object System.Text.StringBuilder
  [void]$line.Append(('{0,3} ' -f $r))
  for ($c = 0; $c -lt $COLS; $c++) {
    $ax = $c / $COLS * 13.3333333
    $ay = $r / $ROWS * 7.5
    $bx = ($c + 1) / $COLS * 13.3333333
    $by = ($r + 1) / $ROWS * 7.5
    $t = @{}
    for ($jy = 0; $jy -lt 3; $jy++) {
      for ($jx = 0; $jx -lt 3; $jx++) {
        $sx2 = $ax + ($bx - $ax) * (($jx + 0.5) / 3)
        $sy2 = $ay + ($by - $ay) * (($jy + 0.5) / 3)
        $cl = Classify (PixAt $sx2 $sy2)
        if ($t.ContainsKey($cl)) { $t[$cl]++ } else { $t[$cl] = 1 }
      }
    }
    $ch = ' '
    if ($t.ContainsKey('black') -and $t['black'] -ge 2) { $ch = '#' }
    elseif ($t.ContainsKey('red') -and $t['red'] -ge 2) { $ch = 'R' }
    elseif ($t.ContainsKey('green') -and $t['green'] -ge 2) { $ch = 'G' }
    elseif ($t.ContainsKey('blue') -and $t['blue'] -ge 2) { $ch = 'W' }
    elseif ($t.ContainsKey('gray') -and $t['gray'] -ge 2) { $ch = 'B' }
    elseif ($t.ContainsKey('black')) { $ch = '+' }
    elseif ($t.ContainsKey('red')) { $ch = 'r' }
    elseif ($t.ContainsKey('green')) { $ch = 'g' }
    elseif ($t.ContainsKey('blue')) { $ch = 'w' }
    elseif ($t.ContainsKey('gray')) { $ch = 'b' }
    elseif ($t.ContainsKey('other')) { $ch = '.' }
    [void]$line.Append($ch)
  }
  W2 $line.ToString()
}
$bmp.Dispose()
$OUT.Flush()
$OUT.Close()


# -*- coding: utf-8 -*-
"""把地图里的动态场景录成 GIF（GitHub README 素材）。

原理：**一次 Chrome 启动，一屏截完所有帧**。
  `_ghshot.py` 一张图要开一次 Chrome（2~8 秒），24 帧就是 24 次；这里改成
  在页面里把所有帧先画进**一张大胶片条**（每帧一块），最后只截一张图，
  再用 Pillow 切片拼成 GIF。`_flaganim.py` 用的是同一招。

⚠️ HUD（标题 / 按键提示 / 坐标）是 **DOM**，不在 `cv` 画布里 ⇒
   `drawImage(cv, …)` 抄出来的帧**天然没有 HUD**，不用另外清。
⚠️ 帧与帧之间必须让 `update()` 推进模拟（旗子、水波、鱼、行人都会跟着动），
   但 `update()` **每帧都会覆写 `cam`**（相机跟人走）——想固定机位就必须
   在 `update()` 之后、`render()` 之前把相机摁回去。
⚠️ 调色板用**首帧的全局板**，不给每帧单独量化 —— 逐帧调色板会让渐变的
   路面/天空在播放时闪。
⚠️ 输出必须是绝对路径（Chrome 的 `--screenshot` 相对它自己的 cwd 落文件）。

用法：
  python _ghanim.py <src.html> <js场景脚本> <out.gif> \
      --zoom 5 --crop 60,0,360,270 --k 2 --cols 6 --nf 24 --fps 15
"""
import io, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _ghshot  # noqa: E402  复用它的注入模板（同一套"藏登录门 + 冻模拟"规矩）

CHROME = _ghshot.CHROME
HERE = os.path.dirname(os.path.abspath(__file__))


def opt(argv):
    o = {'--zoom': 5, '--crop': '0,0,480,270', '--k': 2, '--cols': 6, '--nf': 24,
         '--fps': 15, '--budget': 4000, '--colors': 128}
    i = 0
    while i < len(argv):
        if argv[i] not in o:
            raise SystemExit('未知参数 ' + argv[i])
        o[argv[i]] = argv[i + 1]; i += 2
    return o


def main():
    a = sys.argv[1:]
    if len(a) < 3:
        raise SystemExit(__doc__)
    src, jsfile, out = a[0], a[1], os.path.abspath(a[2])
    o = opt(a[3:])
    cx, cy, cw, ch = [int(v) for v in str(o['--crop']).split(',')]
    K, cols, nf = int(o['--k']), int(o['--cols']), int(o['--nf'])
    fps = float(o['--fps'])

    rows = (nf + cols - 1) // cols
    sw, sh = cw * K, ch * K
    GW, GH = cols * sw, rows * sh

    # ⚠️ 用 replace 而不是 `%` 格式化：场景脚本里有取模 `i % COLS`，
    #    走 `%` 会被当成格式符直接炸。占位符一律写成 `@{NAME}`。
    body = io.open(jsfile, encoding='utf-8').read()
    for k, v in (('@{CROPX}', cx), ('@{CROPY}', cy), ('@{CROPW}', cw), ('@{CROPH}', ch),
                 ('@{K}', K), ('@{COLS}', cols), ('@{NF}', nf), ('@{GW}', GW), ('@{GH}', GH)):
        body = body.replace(k, str(v))
    assert '@{' not in body, '还有没替换掉的占位符：' + body[body.index('@{'):body.index('@{') + 20]
    # 先把条带几何填进场景脚本，再交给 _ghshot 的注入模板（藏登录门 + 冻模拟）
    js = os.path.join(HERE, '_gen_anim.js')
    io.open(js, 'w', encoding='utf-8', newline='\n').write(body)
    gen = _ghshot.build(src, js, int(o['--zoom']), 3, 700)

    strip = os.path.join(HERE, '_strip_%s.png' % os.path.splitext(os.path.basename(out))[0])
    base = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
            '--no-first-run', '--no-default-browser-check',
            '--virtual-time-budget=%d' % int(o['--budget']),
            '--window-size=%d,%d' % (GW, GH)]
    url = 'file:///' + gen.replace('\\', '/')

    d = _ghshot.chrome(['--headless=new', '--dump-dom'] + base[1:] + [url])
    m = re.search(r'<title>(.*?)</title>', d.stdout.decode('utf-8', 'replace'), re.S)
    print('diag:', m.group(1) if m else '<无 title>')

    _ghshot.chrome(base + ['--screenshot=' + strip, url])
    if not os.path.exists(strip) or os.path.getsize(strip) < 2000:
        raise SystemExit('胶片条没出来：' + strip)

    from PIL import Image
    sheet = Image.open(strip).convert('RGB')
    print('胶片条 %dx%d（期望 %dx%d）%d B' % (sheet.width, sheet.height, GW, GH, os.path.getsize(strip)))
    if sheet.width < GW or sheet.height < GH:
        raise SystemExit('⚠️ 截图比条带小 —— 窗口没放下，帧会被截断')

    frames = []
    for i in range(nf):
        x = (i % cols) * sw
        y = (i // cols) * sh
        frames.append(sheet.crop((x, y, x + sw, y + sh)))

    pal = frames[0].quantize(colors=int(o['--colors']), method=Image.MEDIANCUT)
    pframes = [f.quantize(palette=pal, dither=Image.NONE) for f in frames]
    pframes[0].save(out, save_all=True, append_images=pframes[1:],
                    duration=int(round(1000.0 / fps)), loop=0, optimize=True, disposal=2)
    print('GIF %s  %dx%d  %d 帧  %d B' % (out, sw, sh, nf, os.path.getsize(out)))

    # 留一张"首帧 + 半程帧"的预览图，方便肉眼核对步态与取景
    prev = Image.new('RGB', (sw, sh * 2))
    prev.paste(frames[0], (0, 0))
    prev.paste(frames[nf // 2], (0, sh))
    prev.convert('P', palette=pal, dither=Image.NONE).save(
        os.path.join(HERE, '_prev_%s.png' % os.path.splitext(os.path.basename(out))[0]))


if __name__ == '__main__':
    main()

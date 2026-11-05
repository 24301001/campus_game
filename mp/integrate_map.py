"""Apply the lobby hooks to the project's original map HTML files.

Run after the map builder/delivery script. This edits the original filenames in
place; no alternate map page is produced.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MAPS = [ROOT / "像素校园_全校地图.html",
        ROOT / "像素校园地图项目" / "像素校园_全校地图.html",
        ROOT / "像素校园地图项目" / "源码" / "像素校园_全校地图.html"]


def once(text, old, new):
    if new in text and old not in text:
        return text
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected one map hook, found {count}: {old[:80]!r}")
    return text.replace(old, new, 1)


def between(text, start, end, new):
    a, b = text.find(start), text.find(end)
    if a < 0 or b <= a:
        raise RuntimeError(f"Map region missing: {start[:60]!r}")
    return text[:a] + new + text[b:]


def patch(text):
    # At zoom levels below 1x, the original 480x270 backing bitmap first
    # downsamples the entire scene and then stretches it across the monitor.
    # Keep the original 1x path untouched; render overview levels at the
    # screen's integer pixel scale so distant buildings retain their detail.
    text = once(text, '''function resize() {                       // 只做整数倍放大，保证像素不糊
  const s = Math.max(1, Math.floor(Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H)));
  cv.style.width = (VIEW_W * s) + "px";
  cv.style.height = (VIEW_H * s) + "px";
}''', '''function resize() {                       // 原尺寸仍走 480×270 像素背板
  const s = Math.max(1, Math.floor(Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H)));
  const detail = zoom < 1 ? s : 1;          // 缩小视野时按屏幕整数倍补足背板分辨率
  if (cv.width !== VIEW_W * detail || cv.height !== VIEW_H * detail) {
    cv.width = VIEW_W * detail;
    cv.height = VIEW_H * detail;
  }
  ctx.setTransform(detail, 0, 0, detail, 0, 0);
  cv.style.width = (VIEW_W * s) + "px";
  cv.style.height = (VIEW_H * s) + "px";
}''')
    text = once(text, '''  if (rg && Number(rg.value) !== zoomI) rg.value = zoomI;
}''', '''  if (rg && Number(rg.value) !== zoomI) rg.value = zoomI;
  resize();                                // 换档时同步背板分辨率
}''')
    if '/* ---------- 登录门（进地图前的那一次）' in text:
        text = between(text, '/* ---------- 登录门（进地图前的那一次）', '/* ---------- 猫宠：', '')
    text = text.replace(',#login[hidden]', '')
    text = text.replace('  #huduser{display:block;color:#9fb4d0;}\n', '')
    text = text.replace('#hudctr:empty,#huduser:empty', '#hudctr:empty')
    text = text.replace('  <span id="huduser"></span>\n', '')
    old_refs = '''const hudUser     = document.getElementById("huduser");
const loginEl     = document.getElementById("login");
const lgU         = document.getElementById("lgU");
const lgP         = document.getElementById("lgP");
const lgMsg       = document.getElementById("lgMsg");
const lgGo        = document.getElementById("lgGo");
const lgOut       = document.getElementById("lgOut");
'''
    text = text.replace(old_refs, '')
    if 'window.location.href = PCTR_START' in text:
        text = between(text, 'function ctrColdStart(R) {', '/* --- 7.5.14', '''function ctrColdStart(R) {
  CENTER.waiting = false;
  if (window.MP && !MP.connected) { MP.requireLogin(); return; }
  ctrTipMsg("该角色服务暂未启动，请在本机启动后重试。", 6);
}

''')
    if '<script src="mp/lobby.js"></script>' in text and 'function npcEnsure(kind)' in text:
        return text
    text = once(text, '<title>像素校园 · 全校地图</title>',
                '<title>像素校园 · 全校地图</title>\n<link rel="stylesheet" href="mp/theme.css">')
    text = between(text, '<button id="lgOut"', '<!-- 猫宠', '')
    text = between(text, 'function ctrOpenPlatform(R) {', 'function ctrClosePlatform() {', '''function ctrOpenPlatform(R) {
  if (!ctrP) return;
  CENTER.plat = true;
  if (ctrTipEl) ctrTipEl.hidden = true;
  Promise.resolve(R.ensure ? R.ensure() : "ok").then(st => {
    if (!CENTER.plat) return;
    if (st !== "ok") {
      CENTER.plat = false;
      ctrP.hidden = true;
      ctrTipMsg(st === "auth" ? "登录已过期，请在大厅重新登录。" : "该角色服务暂未连通，请启动后重试。", 6);
      if (st === "auth" && window.MP) MP.requireLogin();
      return;
    }
    ctrP.hidden = false;
    if (ctrF && ctrF.getAttribute("src") !== R.app) ctrF.setAttribute("src", R.app);
    ctrBindFrameEsc();
  }).catch(() => { CENTER.plat = false; ctrP.hidden = true; ctrTipMsg("角色服务暂不可用。", 6); });
}
''')
    text = between(text, '/* ⭐⭐ 第四十五轮：**踹醒', 'function ctrTalk() {', '')
    text = between(text, '/* --- 7.5.14 登录门', '/* --- 7.5.15 按键', '''/* --- 7.5.14 统一登录后的角色票 --------------------------------------- */
function npcEnsure(kind) {
  return window.MP ? MP.ensureNpc(kind) : Promise.resolve("auth");
}
function xbgEnsure() { return npcEnsure("xbg"); }
function ldEnsure() { return npcEnsure("ld"); }
function cmrEnsure() { return npcEnsure("cmr"); }
function campusEnsure() { return npcEnsure("agent"); }

''')
    text = between(text, 'if (lgGo) lgGo.addEventListener', '/* ⚠️ iframe 的 `load`', '')
    text = once(text, 'setTimeout(() => { loginGate(); xbgBootSync(); ldBootSync(); cmrBootSync(); ctrHudPulse(); }, 0);',
                'setTimeout(() => { ctrHudPulse(); }, 0);')
    text = once(text, '    { y: CENTER.y, f: () => ctrDrawChar(g, charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }\n  ].sort((a, b) => a.y - b.y);\n  for (const o of who) o.f();',
                '    { y: CENTER.y, f: () => ctrDrawChar(g, window.MP && MP.connected ? MP.sprite(MP.look, CENTER.dir, CENTER.step) : charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }\n  ];\n  if (window.MP) MP.appendIndoorPeers(who, g);\n  who.sort((a, b) => a.y - b.y);\n  for (const o of who) o.f();\n  if (window.MP) MP.drawIndoorLabels(g);')
    text = once(text, '  CENTER.active = true;\n  CENTER.x = R.spawn.x;',
                '  CENTER.active = true;\n  if (window.MP) MP.changeScene(R.key, R.spawn.x, R.spawn.y);\n  CENTER.x = R.spawn.x;')
    text = once(text, '  document.body.classList.remove("ctr-on");\n  /* ⚠️ 玩家在地图上的坐标',
                '  document.body.classList.remove("ctr-on");\n  if (window.MP) MP.changeScene("out", player.x, player.y);\n  /* ⚠️ 玩家在地图上的坐标')
    text = once(text, 'drawList.push({ img: player.act ? poseSprite(player.dir, player.act, _pfr) : charSprite(player.dir, player.step),',
                'drawList.push({ img: window.MP && MP.connected ? (player.act ? MP.crouch(MP.look, player.dir, player.act, _pfr) : MP.sprite(MP.look, player.dir, player.step)) : (player.act ? poseSprite(player.dir, player.act, _pfr) : charSprite(player.dir, player.step)),')
    text = once(text, '  drawList.sort((a, b) => a.baseY - b.baseY);',
                '  if (window.MP) MP.appendOutdoorPeers(drawList);\n  drawList.sort((a, b) => a.baseY - b.baseY);')
    text = once(text, '  update(dt);\n  render();\n  requestAnimationFrame(loop);',
                '  update(dt);\n  if (window.MP) MP.onFrame(now);\n  render();\n  if (window.MP) MP.drawLabels();\n  requestAnimationFrame(loop);')
    text = once(text, '</script>\n</body>\n</html>',
                '</script>\n<script src="mp/look.js"></script>\n<script src="mp/lobby.js"></script>\n</body>\n</html>')
    return text


def main():
    for target in MAPS:
        source = target.read_text(encoding="utf-8")
        changed = patch(source)
        with target.open("w", encoding="utf-8", newline="\n") as file:
            file.write(changed)
        print(f"updated {target} ({len(changed)} chars)")


if __name__ == "__main__":
    main()

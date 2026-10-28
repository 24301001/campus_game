"""Static checks for the original map and the four NPC frontends."""
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
root_map = ROOT / "像素校园_全校地图.html"
project_map = ROOT / "像素校园地图项目" / "像素校园_全校地图.html"
builder_map = ROOT / "像素校园地图项目" / "源码" / "像素校园_全校地图.html"
source = root_map.read_text(encoding="utf-8")
assert root_map.read_bytes() == project_map.read_bytes()
assert root_map.read_bytes() == builder_map.read_bytes()
assert "5208" in source and "mp/lobby.js" in source and "function npcEnsure(kind)" in source
assert "const detail = zoom < 1 ? s : 1" in source
assert "ctx.setTransform(detail, 0, 0, detail, 0, 0)" in source
assert "window.location.href = PCTR_START" not in source
assert 'id="login"' not in source and 'type="password"' not in source
assert all(item not in source for item in ("ctrFrameOnLogin", "XBG_LOGIN", "LD_LOGIN", "CMR_LOGIN", 'id="lgQuick"'))
inline = re.findall(r"<script(?:\s[^>]*)?>(.*?)</script>", source, re.S)
assert inline
with tempfile.TemporaryDirectory() as tmp:
    for index, content in enumerate(inline):
        script = Path(tmp) / f"map_{index}.js"
        script.write_text(content, encoding="utf-8")
        subprocess.run(["node", "--check", str(script)], check=True)

for path in (ROOT / "laoding" / "index.html",
             ROOT / "xueba-ge" / "web" / "index.html",
             ROOT / "campus_game_cmr" / "aunt" / "static" / "index.html"):
    assert 'type="password"' not in path.read_text(encoding="utf-8"), path
router = (ROOT / "campus_game" / "frontend" / "src" / "router" / "index.js").read_text(encoding="utf-8")
assert "views/Login.vue" not in router and "views/Register.vue" not in router
print("PASS: original map, no legacy login form, map syntax, NPC login pages removed")

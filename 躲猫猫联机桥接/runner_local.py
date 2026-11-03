"""本地演示用：假大厅(8399) + 真 bridge(8301) 常驻，给浏览器截图用。
不是产品代码，不上服务器。"""
import json, threading, time, os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
USERS = {t: (10 + i, n) for i, (t, n) in enumerate([("tokA","云验收甲"),("tokB","躲猫猫乙"),("tokC","Iris"),("tokD","算法哥"),("tokE","学霸姐"),("tokF","食堂阿姨"),("tokG","老丁"),("tokH","路人戊")])}
os.environ["BRIDGE_PORT"] = "8301"; os.environ["MP_LOBBY"] = "http://127.0.0.1:8399"
class Stub(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        tok = self.headers.get("Authorization", "").replace("Bearer ", "").strip()
        uid, nick = USERS.get(tok, (None, None))
        code, body = (200, {"id": uid, "nickname": nick}) if uid else (401, {"error": "x"})
        raw = json.dumps(body).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw))); self.end_headers(); self.wfile.write(raw)
threading.Thread(target=lambda: ThreadingHTTPServer(("127.0.0.1", 8399), Stub).serve_forever(), daemon=True).start()
import bridge
print("local demo up: http://127.0.0.1:8301/game/duo1/", flush=True)
bridge.ThreadingHTTPServer(("127.0.0.1", 8301), bridge.Handler).serve_forever()

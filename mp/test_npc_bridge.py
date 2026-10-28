"""Exercise four NPC ticket exchanges with isolated local service doubles."""
import json
import os
import socket
import sys
import tempfile
import threading
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def service(kind):
    accounts = {}

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *_):
            pass

        def do_POST(self):
            data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
            field = {"xbg": "nick", "ld": "nickname", "cmr": "username", "agent": "username"}[kind]
            if field not in data or "password" not in data:
                return self.reply(200, {"service": kind, "path": self.path, "forwarded": True})
            name, password = data[field], data["password"]
            operation = self.path.rsplit("/", 1)[-1]
            if operation == "register":
                if name in accounts:
                    return self.reply(409, {"error": "exists"})
                accounts[name] = password
            elif accounts.get(name) != password:
                return self.reply(401, {"error": "bad credentials"})
            if kind == "cmr":
                return self.reply(200, {"id": len(accounts), "username": name}, "aunt_session=fake; HttpOnly; Path=/")
            if kind == "agent":
                return self.reply(200, {"code": 200, "data": {"token": "agent-" + name,
                    "userId": len(accounts), "username": name, "nickname": data.get("nickname", name), "role": "USER"}})
            return self.reply(200, {"token": kind + "-" + name, "user": {"nick": name}})

        def do_GET(self):
            self.reply(200, {"path": self.path, "service": kind})

        def reply(self, code, value, cookie=None):
            body = json.dumps(value).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            if cookie:
                self.send_header("Set-Cookie", cookie)
            self.end_headers()
            self.wfile.write(body)

    http = ThreadingHTTPServer(("127.0.0.1", free_port()), Handler)
    threading.Thread(target=http.serve_forever, daemon=True).start()
    return http, accounts


def request(port, path, *, method="GET", data=None, token=None, cookie=None):
    headers = {}
    if token:
        headers["Authorization"] = "Bearer " + token
    if cookie:
        headers["Cookie"] = cookie
    body = None if data is None else json.dumps(data).encode()
    if body is not None:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", data=body,
                                 headers=headers, method=method)
    for attempt in range(3):
        try:
            response = urllib.request.urlopen(req, timeout=3)
            break
        except urllib.error.HTTPError as exc:
            response = exc
            break
        except (ConnectionAbortedError, ConnectionResetError):
            if attempt == 2:
                raise
    with response:
        return response.status, json.load(response), response.headers.get("Set-Cookie", "")


def check_gateway(server, doubles):
    """Exercise the public HTTP gate, rather than only calling npc_ticket directly."""
    # The production proxy routes to fixed local service ports. Redirect only
    # those ports to isolated test doubles, leaving the gateway's own port alone.
    original_connection = server.http.client.HTTPConnection
    service_ports = {8010: doubles["xbg"][0].server_port,
                     8000: doubles["ld"][0].server_port,
                     8020: doubles["cmr"][0].server_port,
                     8081: doubles["agent"][0].server_port,
                     3001: doubles["agent"][0].server_port}

    class RedirectConnection(original_connection):
        def __init__(self, host, port=None, *args, **kwargs):
            super().__init__(host, service_ports.get(port, port), *args, **kwargs)

    server.http.client.HTTPConnection = RedirectConnection
    gateway = ThreadingHTTPServer(("127.0.0.1", free_port()), server.Handler)
    threading.Thread(target=gateway.serve_forever, daemon=True).start()
    port = gateway.server_port
    try:
        paths = {"xbg": "/xbg", "ld": "/ld", "cmr": "/cmr", "agent": "/agent"}
        for path in paths.values():
            assert request(port, path)[0] == 401
        assert request(port, "/api/agent/status")[0] == 401
        assert request(port, "/api/mp/npc/agent", method="POST", data={})[0] == 401
        users = []
        for nickname in ("网关测试甲", "网关测试乙"):
            status, _, _ = request(port, "/api/mp/register", method="POST",
                                   data={"nickname": nickname, "password": "testpass123"})
            assert status == 201
            status, account, set_cookie = request(port, "/api/mp/login", method="POST",
                                                  data={"nickname": nickname, "password": "testpass123"})
            assert status == 200 and "HttpOnly" in set_cookie
            users.append((account["token"], set_cookie.split(";", 1)[0]))
        (a_token, a_cookie), (b_token, b_cookie) = users
        for path in paths.values():
            assert request(port, path, cookie=a_cookie)[0] == 403
        for health in ("/xbg/api/health", "/ld/api/health", "/cmr/api/health", "/api/agent/status"):
            assert request(port, health, cookie=a_cookie)[0] == 200
        for kind, path in paths.items():
            status, ticket, cookie = request(port, f"/api/mp/npc/{kind}", method="POST", data={}, token=a_token)
            assert status == 200 and ticket["kind"] == kind
            if kind == "cmr":
                assert cookie.startswith("aunt_session=")
            elif kind == "agent":
                assert ticket["user"]["token"]
            else:
                assert ticket["token"]
            status, result, _ = request(port, path, cookie=a_cookie)
            assert status == 200 and result["service"] == kind
            assert request(port, path, cookie=b_cookie)[0] == 403
            assert request(port, f"/api/mp/npc/{kind}", method="POST", data={}, token=b_token)[0] == 200
            assert request(port, path, cookie=b_cookie)[0] == 200
        for blocked in ("/xbg/api/login", "/xbg/api/register", "/ld/api/login", "/ld/api/register",
                        "/cmr/api/login", "/cmr/api/register",
                        "/api/auth/login", "/api/auth/register", "/api/auth%2Flogin"):
            assert request(port, blocked, method="POST", data={}, cookie=a_cookie)[0] == 403, blocked
        # Path syntax can be normalized differently by a downstream framework.
        # Reject alternate spellings before the request reaches any NPC service.
        variants = (
            "/xbg/api/%6cogin", "/xbg/api/%256cogin", "/xbg%2fapi%2flogin",
            "/ld/api/%72egister", "/cmr%2Fapi%2Fregister",
            "/api/%61uth/login", "/api/%2561uth/login", "/api/auth%2Fregister",
            "/xbg/API/LOGIN", "/XBG/api/login", "/api/AUTH/LOGIN", "/API/auth/login",
            "/xbg//api/login", "/xbg/api/./login", "/ld/api//register",
            "/cmr/api/./login", "/xbg/api/x/../login", "/ld/api/%2e%2e/api/login",
            "/api//auth/login", "/api/./auth/register", "/api/x/../auth/login",
            "/api/auth;v=1/login",
        )
        bypasses = [(path, request(port, path, method="POST", data={}, cookie=a_cookie)[0])
                    for path in variants]
        assert all(status in (400, 403, 404) for _, status in bypasses), bypasses
        status, _, _ = request(port, "/api/mp/session", method="POST", data={}, token=b_token)
        assert status == 200
        assert request(port, "/api/mp/logout", method="POST", data={}, token=a_token)[0] == 200
        for path in paths.values():
            assert request(port, path, cookie=a_cookie)[0] == 401
        assert request(port, "/api/mp/npc/agent", method="POST", data={}, token=a_token)[0] == 401
        # A fresh login invalidates old cookies and grants for the same account.
        status, fresh_account, fresh_cookie = request(port, "/api/mp/login", method="POST",
                                                     data={"nickname": "网关测试乙", "password": "testpass123"})
        assert status == 200
        fresh_cookie = fresh_cookie.split(";", 1)[0]
        for path in paths.values():
            assert request(port, path, cookie=b_cookie)[0] == 401
            assert request(port, path, cookie=fresh_cookie)[0] == 403
        assert request(port, "/api/mp/npc/unknown", method="POST", data={},
                       token=fresh_account["token"])[0] == 404
        old_agent_port = server.NPC_PORTS["agent"]
        try:
            unavailable = free_port()
            while unavailable in service_ports:
                unavailable = free_port()
            server.NPC_PORTS["agent"] = unavailable
            assert request(port, "/api/mp/npc/agent", method="POST", data={},
                           token=fresh_account["token"])[0] == 503
            assert request(port, "/agent", cookie=fresh_cookie)[0] == 403
        finally:
            server.NPC_PORTS["agent"] = old_agent_port
        print("PASS: gateway enforces one login, per-user NPC grants, session renewal and logout")
    finally:
        gateway.shutdown()
        gateway.server_close()
        server.http.client.HTTPConnection = original_connection


def main():
    with tempfile.TemporaryDirectory() as tmp:
        os.environ["MP_DB"] = str(Path(tmp) / "bridge.sqlite3")
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        import server

        doubles = {kind: service(kind) for kind in ("xbg", "ld", "cmr", "agent")}
        try:
            server.NPC_PORTS.update({kind: http.server_port for kind, (http, _) in doubles.items()})
            users = []
            for nickname in ("测试甲", "测试乙"):
                cur = server.execute("INSERT INTO mp_user(nickname,salt,password_hash) VALUES(?,?,?)",
                                     (nickname, b"salt", b"hash"))
                users.append({"id": cur.lastrowid, "nickname": nickname})
            for kind, (_, accounts) in doubles.items():
                first, cookie1 = server.npc_ticket(users[0], kind)
                second, cookie2 = server.npc_ticket(users[1], kind)
                again, _ = server.npc_ticket(users[0], kind)
                assert len(accounts) == 2
                assert server.npc_credentials(users[0]["id"], kind)[0] != server.npc_credentials(users[1]["id"], kind)[0]
                assert first["kind"] == second["kind"] == kind
                if kind == "cmr":
                    assert cookie1 and cookie2
                elif kind == "agent":
                    assert first["user"]["token"] != second["user"]["token"]
                    assert first["user"]["token"] == again["user"]["token"]
                else:
                    assert first["token"] != second["token"], (kind, first, second)
                    assert first["token"] == again["token"]
            print("PASS: four NPC ticket flows; two lobby users map to isolated service accounts")
            check_gateway(server, doubles)
        finally:
            for http, _ in doubles.values():
                http.shutdown()
                http.server_close()
            server.db.close()


if __name__ == "__main__":
    main()

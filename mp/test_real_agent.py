"""Exercise the real Java algorithm NPC through an isolated local lobby.

Start isolated MySQL on 3307, the Java backend on 8081, Vite on 3001,
and a lobby using a disposable MP_DB before running this script.
"""

from __future__ import annotations

import json
import secrets
import urllib.error
import urllib.request
from http.cookiejar import CookieJar


BASE = "http://127.0.0.1:3012"


def call(opener, path, data=None, token=None):
    body = json.dumps(data).encode() if data is not None else None
    headers = {"Content-Type": "application/json"} if body is not None else {}
    if path == "/agent":
        headers["Accept"] = "text/html"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(BASE + path, data=body, headers=headers)
    with opener.open(request, timeout=12) as response:
        raw = response.read()
        return response.status, json.loads(raw) if response.headers.get_content_type() == "application/json" else raw


def new_user():
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(CookieJar()))
    name = "agent_" + secrets.token_hex(4)
    password = "test_" + secrets.token_hex(12)
    assert call(opener, "/api/mp/register", {"nickname": name, "password": password})[0] == 201
    status, data = call(opener, "/api/mp/login", {"nickname": name, "password": password})
    assert status == 200
    return opener, data["token"]


def main():
    people = [new_user(), new_user()]
    tickets = []
    for opener, lobby_token in people:
        status, data = call(opener, "/api/mp/npc/agent", {}, lobby_token)
        assert status == 200 and data["kind"] == "agent", data
        assert data["user"]["token"]
        tickets.append(data["user"])
        status, profile = call(opener, "/api/user/info", token=data["user"]["token"])
        assert status == 200 and profile["code"] == 200
        assert profile["data"]["username"] == data["user"]["username"]
        status, html = call(opener, "/agent")
        assert status == 200 and b"<html" in html.lower()
    assert tickets[0]["userId"] != tickets[1]["userId"]
    assert tickets[0]["username"] != tickets[1]["username"]

    try:
        call(people[0][0], "/api/auth/login", {"username": "x", "password": "x"})
    except urllib.error.HTTPError as error:
        assert error.code == 403, error.code
    else:
        raise AssertionError("Subordinate login endpoint should be blocked by the lobby")

    print("PASS: two distinct lobby users received real Java JWTs, read their own profiles, and loaded Vite via /agent; subordinate login blocked")


if __name__ == "__main__":
    main()

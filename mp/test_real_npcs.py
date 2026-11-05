"""Two-user smoke test against all four running local NPC services.

Uses a disposable lobby on 127.0.0.1:3012 and never sends chat/LLM requests.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request

from test_real_agent import BASE, call, new_user


def request(opener, path, *, method="GET", data=None, token=None, html=False):
    payload = json.dumps(data).encode() if data is not None else None
    headers = {}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = "Bearer " + token
    if html:
        headers["Accept"] = "text/html"
    req = urllib.request.Request(BASE + path, data=payload, headers=headers, method=method)
    with opener.open(req, timeout=20) as response:
        raw = response.read()
        parsed = json.loads(raw) if response.headers.get_content_type() == "application/json" else raw
        return response.status, parsed


def code_when_denied(opener, path, token=None):
    try:
        status, data = request(opener, path, token=token)
    except urllib.error.HTTPError as error:
        return error.code
    if isinstance(data, dict):
        return data.get("code", status)
    return status


def main():
    people = [new_user(), new_user()]
    tickets = [{}, {}]
    for kind in ("ld", "xbg", "cmr", "agent"):
        for i, (opener, lobby_token) in enumerate(people):
            status, ticket = call(opener, "/api/mp/npc/" + kind, {}, lobby_token)
            assert status == 200 and ticket["kind"] == kind, (kind, ticket)
            tickets[i][kind] = ticket

        for opener, _ in people:
            path = {"ld": "/ld/", "xbg": "/xbg/", "cmr": "/cmr/", "agent": "/agent"}[kind]
            status, html = request(opener, path, html=True)
            assert status == 200 and b"<html" in html.lower(), (kind, status)

    first, second = people[0][0], people[1][0]

    guard_ids = []
    for i, (opener, _) in enumerate(people):
        token = tickets[i]["ld"]["token"]
        status, me = request(opener, "/ld/api/me", token=token)
        assert status == 200
        guard_ids.append(me["user_id"])
    assert guard_ids[0] != guard_ids[1]

    scholar_ids = []
    for i, (opener, _) in enumerate(people):
        token = tickets[i]["xbg"]["token"]
        status, me = request(opener, "/xbg/api/me", token=token)
        assert status == 200
        scholar_ids.append(me["id"])
        assert request(opener, "/xbg/api/sessions", token=token)[0] == 200
    assert scholar_ids[0] != scholar_ids[1]
    status, created = request(first, "/xbg/api/session/new", method="POST", data={}, token=tickets[0]["xbg"]["token"])
    assert status == 200 and created["session"]
    status, other_sessions = request(second, "/xbg/api/sessions", token=tickets[1]["xbg"]["token"])
    assert created["session"] not in json.dumps(other_sessions)
    assert code_when_denied(second, "/xbg/api/history?session=" + created["session"], tickets[1]["xbg"]["token"]) == 403

    aunt_ids = []
    for opener, _ in people:
        status, me = request(opener, "/cmr/api/me")
        assert status == 200
        aunt_ids.append(me["id"])
        assert request(opener, "/cmr/api/conversations")[0] == 200
    assert aunt_ids[0] != aunt_ids[1]
    status, conversation = request(first, "/cmr/api/conversations", method="POST", data={})
    assert status == 200 and conversation["id"]
    status, other_conversations = request(second, "/cmr/api/conversations")
    assert conversation["id"] not in [item["id"] for item in other_conversations]
    assert code_when_denied(second, f"/cmr/api/conversations/{conversation['id']}/messages") == 404

    agent_ids = []
    for i, (opener, _) in enumerate(people):
        token = tickets[i]["agent"]["user"]["token"]
        status, me = request(opener, "/api/user/info", token=token)
        assert status == 200 and me["code"] == 200
        agent_ids.append(me["data"]["id"])
        status, sessions = request(opener, "/api/agent/sessions", token=token)
        assert status == 200 and sessions["code"] == 200
    assert agent_ids[0] != agent_ids[1]
    status, created = request(first, "/api/agent/session?title=isolated", method="POST", data={}, token=tickets[0]["agent"]["user"]["token"])
    assert status == 200 and created["code"] == 200 and created["data"]["id"]
    aid = created["data"]["id"]
    status, other_sessions = request(second, "/api/agent/sessions", token=tickets[1]["agent"]["user"]["token"])
    assert aid not in [item["id"] for item in other_sessions["data"]]
    assert code_when_denied(second, f"/api/agent/messages?sessionId={aid}", tickets[1]["agent"]["user"]["token"]) != 200

    print("PASS: two users have separate identities on all four real NPCs; all four pages load; scholar, aunt, and agent session/history isolation verified")


if __name__ == "__main__":
    main()

"""Profile visibility and private sent-history checks against isolated lobby :3012."""
import json
import secrets
import sqlite3
import time
import urllib.error
import urllib.request
from pathlib import Path

BASE = "http://127.0.0.1:3012"
DB = Path(__file__).with_name("qa-new.sqlite3")


def call(path, token="", method="GET", body=None):
    payload = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(BASE + path, data=payload, method=method,
                                     headers={"Content-Type": "application/json", "Authorization": "Bearer " + token})
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as error:
        return error.code, json.load(error)


def create():
    nickname = "profile_" + secrets.token_hex(4)
    password = "pass_" + secrets.token_hex(12)
    assert call("/api/mp/register", method="POST", body={"nickname": nickname, "password": password})[0] == 201
    status, result = call("/api/mp/login", method="POST", body={"nickname": nickname, "password": password})
    assert status == 200
    return result["token"], result["user"]["id"]


def main():
    owner, owner_id = create()
    viewer, viewer_id = create()
    status, existing = call("/api/mp/profile/me", owner)
    assert status == 200
    look = {**existing["look"], "eye": "dot", "eyeColor": "#3a74b2"}
    status, _ = call("/api/mp/profile/me", owner, "PUT", {
        "look": look, "bio": "公开签名", "college": "信息学院", "grade": "大三", "tags": ["像素", "游戏"],
        "visibility": {"bio": True, "college": True, "grade": True, "tags": True}})
    assert status == 200
    status, public = call(f"/api/mp/profile/{owner_id}", viewer)
    assert status == 200 and public["bio"] == "公开签名" and public["college"] == "信息学院"
    assert public["grade"] == "大三" and public["tags"] == ["像素", "游戏"]
    assert public["look"]["eyeColor"] == "#3a74b2"
    assert all(public["visibility"].values())
    status, _ = call("/api/mp/profile/me", owner, "PUT", {
        "look": look, "bio": "保密", "college": "信息学院", "grade": "大三", "tags": ["像素"],
        "visibility": {"bio": False, "college": True, "grade": True, "tags": False}})
    assert status == 200
    _, public = call(f"/api/mp/profile/{owner_id}", viewer)
    assert public["bio"] == "" and public["tags"] == []
    assert public["visibility"]["bio"] is False and public["visibility"]["tags"] is False
    _, mine = call("/api/mp/profile/me", owner)
    assert mine["bio"] == "保密" and mine["tags"] == ["像素"]

    with sqlite3.connect(DB) as db:
        db.execute("INSERT INTO mp_announcement(user_id,content,created_at) VALUES(?,?,?)", (owner_id, "自己的公告", time.time()))
        db.execute("INSERT INTO mp_announcement(user_id,content,created_at) VALUES(?,?,?)", (viewer_id, "别人的公告", time.time()))
        db.execute("INSERT INTO mp_session(user_a,user_b,created_at) VALUES(?,?,?)", (min(owner_id,viewer_id), max(owner_id,viewer_id), time.time()))
        sid = db.execute("SELECT id FROM mp_session WHERE user_a=? AND user_b=?", (min(owner_id,viewer_id), max(owner_id,viewer_id))).fetchone()[0]
        db.execute("INSERT INTO mp_message(session_id,from_user,to_user,content,created_at) VALUES(?,?,?,?,?)", (sid,owner_id,viewer_id,"我发的私聊",time.time()))
        db.execute("INSERT INTO mp_message(session_id,from_user,to_user,content,created_at) VALUES(?,?,?,?,?)", (sid,viewer_id,owner_id,"对方发的私聊",time.time()))
    status, history = call("/api/mp/history/me", owner)
    assert status == 200 and [a["content"] for a in history["announcements"]] == ["自己的公告"]
    assert [m["content"] for m in history["private"]] == ["我发的私聊"]
    assert history["private"][0]["to"] == viewer_id
    assert call("/api/mp/history/me")[0] == 401
    assert call(f"/api/mp/history/{owner_id}", viewer)[0] == 404
    print("PASS: complete public fields, hidden fields, eye color, own sent records, no cross-account history")


if __name__ == "__main__":
    main()

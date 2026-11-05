"""3d 房间 · 联机房间服务器（第一步：只转发，不跑任何游戏逻辑）

职责刻意做小：按房间码把两个人配成一对，收到的 JSON 原样转给对端。
丧尸、伤害、门这些一律还是各人自己算（第一步只验证"能看到对方"这条链路）。

为什么用 WebSocket 而不是 WebRTC：WebRTC 要 STUN/TURN 打洞，公共 STUN 在国内
经常拿不到地址，联调时间会全花在"连不上"上；而两人份的状态包极小（下面有账），
走服务器中继完全不亏。

跑法：  python room_server.py 8124 [绑定地址]
       本机双开用默认 127.0.0.1；两台电脑联机传 0.0.0.0
依赖：  pip install websockets
"""
import asyncio
import json
import sys
from collections import defaultdict

import websockets

MAX_PER_ROOM = 2
rooms = defaultdict(set)      # 房间码 -> {ws, ...}
slot = {}                     # ws -> (房间码, 座位号)


def peers(room):
    """同房间里除了自己以外的连接。"""
    return [w for w in rooms[room] if True]


async def relay(ws, msg):
    """把一条文本原样转给同房间的对端；对端不在就回一句 notready。"""
    room, _me = slot.get(ws, (None, None))
    if room is None:
        return
    sent = 0
    for other in list(rooms[room]):
        if other is ws:
            continue
        try:
            await other.send(msg)
            sent += 1
        except Exception:
            pass
    if not sent:
        try:
            await ws.send(json.dumps({"t": "notready"}))
        except Exception:
            pass


async def handler(ws, *args):
    """websockets ≥14 只传一个参数；路径从 ws.request.path 拿。"""
    try:
        path = ws.request.path
    except AttributeError:                                  # 老版本兜底
        path = (args[0].path if args else "/")
    room = (path.split("/r/")[-1] if "/r/" in path else "").strip("/").upper() or "MAIN"

    if len(rooms[room]) >= MAX_PER_ROOM:
        await ws.send(json.dumps({"t": "full", "room": room, "cap": MAX_PER_ROOM}))
        await ws.close()
        return

    me = len(rooms[room]) + 1
    rooms[room].add(ws)
    slot[ws] = (room, me)
    print(f"[房间 {room}] 第 {me} 人进来，现在 {len(rooms[room])} 人")

    await ws.send(json.dumps({"t": "welcome", "room": room, "slot": me,
                              "peer": len(rooms[room]) - 1}))
    # 告诉对端"新人来了"，让它把状态重发一遍（省得新人对着空气等）
    await relay(ws, json.dumps({"t": "hello", "slot": me}))

    try:
        async for raw in ws:
            if isinstance(raw, bytes):
                raw = raw.decode("utf-8", "ignore")
            if not raw:
                continue
            # 只做最小校验：必须是能解析的 JSON、且不是伪造的控制帧
            try:
                obj = json.loads(raw)
            except Exception:
                continue
            if not isinstance(obj, dict) or obj.get("t") in ("welcome", "full", "peerleft", "notready"):
                continue
            obj["slot"] = me
            await relay(ws, json.dumps(obj, separators=(",", ":")))
    except Exception:
        pass
    finally:
        room, me = slot.pop(ws, (None, None))
        if room:
            rooms[room].discard(ws)
            if not rooms[room]:
                rooms.pop(room, None)
            else:
                for other in list(rooms[room]):
                    try:
                        await other.send(json.dumps({"t": "peerleft", "slot": me}))
                    except Exception:
                        pass
            print(f"[房间 {room}] 第 {me} 人走了，剩 {len(rooms[room])} 人")


async def main(port, host):
    async with websockets.serve(handler, host, port, max_size=64 * 1024):
        print(f"3d 房间 · 联机房间服务器已启动：ws://{host}:{port}/r/<房间码>")
        print("  两个人各开一个浏览器，地址后面加 ?room=同一个码 即可进同一间房")
        await asyncio.Future()          # 一直挂着


if __name__ == "__main__":
    p = int(sys.argv[1]) if len(sys.argv) > 1 else 8124
    host = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"
    try:
        asyncio.run(main(p, host))
    except KeyboardInterrupt:
        pass

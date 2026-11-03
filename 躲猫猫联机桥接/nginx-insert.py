"""往 campus-portal 里插一条 location /game/（deploy.sh 调它，root 权限下跑）。

为什么不直接在 shell 里 sed：nginx 片段里有 `$host`，塞进 awk/sed 的引号里会被当成
字段引用或变量展开，静默写坏配置。这里用整块文本插入 + 锚点命中数断言。
幂等：已经有 location /game/ 就跳过（deploy.sh 也判了一层，这里是第二道）。
"""
PATH_NGX = "/etc/nginx/sites-available/campus-portal"
ANCHOR = "    location = /duo1 {"
BLOCK = """    location /game/ {
        proxy_pass http://127.0.0.1:8300;
        proxy_set_header Host $host;
        proxy_read_timeout 60s;
    }

"""

src = open(PATH_NGX, encoding="utf-8").read()
if "location /game/" in src:
    print("  已有 location /game/，跳过")
    raise SystemExit(0)
hits = src.count(ANCHOR)
if hits != 1:
    print("  锚点命中 %d 次（要 1 次）⇒ 不写" % hits)
    raise SystemExit(1)
out = src.replace(ANCHOR, BLOCK + ANCHOR, 1)
open(PATH_NGX, "w", encoding="utf-8").write(out)
chk = open(PATH_NGX, encoding="utf-8").read()
assert chk.count("location /game/ {") == 1 and chk.count(ANCHOR) == 1, "写后骨架不对"
print("  已插入 location /game/（在 /duo1 前面）")

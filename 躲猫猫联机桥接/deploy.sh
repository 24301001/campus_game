#!/bin/bash
# 躲猫猫联机桥接 · 上线脚本（在服务器上跑，需要 sudo）
# 用法：  ssh administrator@38.247.162.154
#         sudo bash /home/administrator/duobridge/deploy.sh
# 幂等：重复跑不会插两行、不会覆盖已有备份。要撤：sudo bash /home/administrator/duobridge/rollback.sh
set -uo pipefail

SRC=/home/administrator/duobridge
MAP=/opt/campus_portal/像素校园_全校地图.html
SRV=/opt/campus_portal/mp/server.py
NGX=/etc/nginx/sites-available/campus-portal
# 打补丁时依据的线上版本。对不上说明队友改过线上文件，必须停下来重打补丁，不能拿旧副本盖上去。
BASE_MAP_MD5=e1743174c483f5320027cdba2d98d333
BASE_SRV_MD5=9482a3f3773a1e1a9888f931a3570960

[ -d "$SRC" ] || { echo "找不到 $SRC"; exit 1; }
[ "$(id -u)" = 0 ] || { echo "请用 sudo bash $0 跑"; exit 1; }
step() { echo; echo "=== $* ==="; }
die()  { echo; echo "STOP  $*"; exit 1; }

step "0 闸：线上文件必须还是我打补丁时那份"
m=$(md5sum "$MAP" | cut -d' ' -f1); s=$(md5sum "$SRV" | cut -d' ' -f1)
echo "地图   $m"
echo "server $s"
[ "$m" = "$BASE_MAP_MD5" ] || die "地图已被人改过（$m ≠ $BASE_MAP_MD5）⇒ 停，重打补丁再来"
[ "$s" = "$BASE_SRV_MD5" ] || die "server.py 已被人改过 ⇒ 停"

step "1 备份（已存在就不覆盖）"
for f in "$MAP" "$SRV" "$NGX"; do
  [ -e "$f.bak-duobridge" ] || cp -a "$f" "$f.bak-duobridge"
  echo "  $f.bak-duobridge"
done

step "2 桥接服务（新目录，不碰像素校园和 duo1）"
mkdir -p /opt/campus_bridge
cp -a "$SRC"/bridge.py "$SRC"/lobby.html "$SRC"/probe-pointer-lock.html /opt/campus_bridge/
chown -R wr:wr /opt/campus_bridge
/opt/campus_venv/bin/python -c "import ast;ast.parse(open('/opt/campus_bridge/bridge.py',encoding='utf-8').read())" \
  && echo "  bridge.py 语法 OK"

step "3 systemd + 本机端口"
cp -a "$SRC"/campus-bridge.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now campus-bridge
sleep 1.5
echo -n "  is-active: "; systemctl is-active campus-bridge
echo -n "  healthz  : "; curl -s http://127.0.0.1:8300/game/healthz; echo

step "4 nginx 加一条 location /game/"
if grep -q "location /game/" "$NGX"; then
  echo "  已存在，跳过"
else
  cp -a "$SRC"/nginx-insert.py /tmp/nginx-insert.py
  /opt/campus_venv/bin/python /tmp/nginx-insert.py || die "nginx 片段插入失败（锚点不对）"
fi
nginx -t || die "nginx -t 没过 ⇒ 配置没 reload，线上不受影响"
systemctl reload nginx && echo "  nginx 已 reload"

step "5 地图侧三处（公告栏脚本 + 那一行 script + 白名单）"
cp -a "$SRC"/duo1-bridge.js /opt/campus_portal/mp/duo1-bridge.js
cp -a "$SRC"/map_patched.html "$MAP"
cp -a "$SRC"/server_patched.py "$SRV"
chown wr:wr /opt/campus_portal/mp/duo1-bridge.js "$MAP" "$SRV"
systemctl restart campus-lobby
sleep 2
echo -n "  campus-lobby: "; systemctl is-active campus-lobby

step "6 公网验收"
U=http://38.247.162.154
for p in / /duo1/ /agent /game/duo1/ /game/healthz /mp/duo1-bridge.js; do
  printf "  %-22s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $U$p)"
done
echo -n "  公告栏脚本可取: "; curl -s $U/mp/duo1-bridge.js | head -c 40; echo " …"
echo -n "  地图里那一行  : "; grep -c 'mp/duo1-bridge.js' "$MAP"
echo    "  其余服务      : $(systemctl is-active campus-ld campus-xbg campus-cmr campus-agent campus-agent-web campus-duo1-room mysql nginx | tr '\n' ' ')"
echo
echo "DONE  浏览器开 $U/ → 登录 → 进逸夫楼 → 走到学霸姐对面那块公告栏前 → 按 F"
echo "      只想先验指针锁：开 $U/game/probe-pointer-lock，点一下画面看 PASS/FAIL"

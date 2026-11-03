#!/bin/bash
# 只更新三个文件（公告栏脚本 / 大厅页 / 地图里那一行的版本号），不重装服务。
# 用法：sudo bash /home/administrator/duobridge/update.sh
set -uo pipefail
SRC=/home/administrator/duobridge
MAP=/opt/campus_portal/像素校园_全校地图.html
# 上一版打好补丁的地图指纹。对不上说明线上地图被谁动过 ⇒ 停，别盖。
EXPECT_LIVE=face285497118d9184c6c4c57e52ecf8

[ "$(id -u)" = 0 ] || { echo "请用 sudo bash $0 跑"; exit 1; }
m=$(md5sum "$MAP" | cut -d' ' -f1)
if [ "$m" != "$EXPECT_LIVE" ]; then
  echo "STOP 线上地图 md5 = $m，不是预期的 $EXPECT_LIVE"
  echo "      ⇒ 有人在你上次部署之后改过地图。先重新拉一份、重跑 install.py，再来。"
  exit 1
fi

cp -a "$SRC"/duo1-bridge.js /opt/campus_portal/mp/duo1-bridge.js
cp -a "$SRC"/lobby.html     /opt/campus_bridge/lobby.html
cp -a "$SRC"/map_patched.html "$MAP"
chown wr:wr /opt/campus_portal/mp/duo1-bridge.js "$MAP" /opt/campus_bridge/lobby.html
echo "已更新三个文件（不用重启：大厅按请求实时读盘，bridge 每次现读 lobby.html）"

echo "=== 验收 ==="
echo -n "  /game/healthz        : "; curl -s http://127.0.0.1:8300/game/healthz; echo
echo -n "  公告栏脚本可取        : "; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000/mp/duo1-bridge.js
echo -n "  脚本里「躲猫猫」出现  : "; curl -s http://127.0.0.1:3000/mp/duo1-bridge.js | grep -c "躲猫猫"
echo -n "  地图引用新版本号      : "; grep -c 'duo1-bridge.js?v=duobridge02' "$MAP"
echo -n "  地图里旧版本号残留    : "; grep -c 'duobridge01' "$MAP" || true
echo -n "  大厅页标题            : "; curl -s http://127.0.0.1:8300/game/duo1/ | grep -o '<title>[^<]*</title>'
echo -n "  公网 / 与 /game/duo1/ : "; printf "%s " "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/)"; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1/game/duo1/
echo "DONE  浏览器请硬刷新一次（Ctrl+F5），再走到学霸姐对面那块牌子前"

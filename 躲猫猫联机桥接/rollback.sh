#!/bin/bash
# 撤掉这次上线：地图/白名单/nginx 回到 .bak-duobridge，桥接服务停掉并禁用。
# 用法：sudo bash /home/administrator/duobridge/rollback.sh
set -uo pipefail
MAP=/opt/campus_portal/像素校园_全校地图.html
SRV=/opt/campus_portal/mp/server.py
NGX=/etc/nginx/sites-available/campus-portal

[ "$(id -u)" = 0 ] || { echo "请用 sudo bash $0 跑"; exit 1; }

systemctl disable --now campus-bridge 2>/dev/null && echo "  campus-bridge 已停用" || echo "  campus-bridge 本来就没在跑"
rm -f /etc/systemd/system/campus-bridge.service
systemctl daemon-reload

for f in "$MAP" "$SRV"; do
  if [ -e "$f.bak-duobridge" ]; then cp -a "$f.bak-duobridge" "$f"; echo "  还原 $f"; else echo "  没有备份，跳过 $f"; fi
done
rm -f /opt/campus_portal/mp/duo1-bridge.js && echo "  删掉公告栏脚本"

if [ -e "$NGX.bak-duobridge" ]; then
  cp -a "$NGX.bak-duobridge" "$NGX" && echo "  还原 nginx 配置"
  nginx -t && systemctl reload nginx && echo "  nginx 已 reload"
fi
systemctl restart campus-lobby && sleep 2
echo -n "  campus-lobby: "; systemctl is-active campus-lobby
U=http://38.247.162.154
for p in / /duo1/ /game/duo1/; do printf "  %-16s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' $U$p)"; done
echo "  （/game/ 回到 404 就是撤干净了；/opt/campus_bridge 目录留着没删，要删说一声）"

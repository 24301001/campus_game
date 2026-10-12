#!/usr/bin/env bash
#
# 在线编程刷题平台 - 一键启动脚本 (Linux/WSL/Mac)
#
set -euo pipefail

# ========== 配置 ==========
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_PORT=8081
FRONTEND_PORT=3000
MYSQL_USER="root"
MYSQL_PASS="Tamako99"
MYSQL_DB="coding_platform"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT=3306

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }
log_step()  { echo -e "${CYAN}[$1/$2]${NC} $3"; }
separator() { echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"; }

TOTAL_STEPS=6

cleanup() {
    echo ""
    log_warn "正在关闭服务..."
    [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null && log_info "后端已停止"
    [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null && log_info "前端已停止"
    log_info "所有服务已关闭"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# ========== 启动 ==========
clear
echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  🚀 在线编程刷题平台 - 一键启动${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# ---------- 1. MySQL ----------
log_step 1 $TOTAL_STEPS "检查 MySQL 连接..."
if command -v mysqladmin &>/dev/null; then
    if mysqladmin ping -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" --silent 2>/dev/null; then
        log_info "MySQL 运行中 ($MYSQL_HOST:$MYSQL_PORT)"
    else
        log_warn "MySQL 未响应，尝试启动..."
        if command -v systemctl &>/dev/null; then
            sudo systemctl start mysql 2>/dev/null || sudo systemctl start mysqld 2>/dev/null || true
        elif command -v service &>/dev/null; then
            sudo service mysql start 2>/dev/null || true
        fi
        sleep 2
        if mysqladmin ping -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" --silent 2>/dev/null; then
            log_info "MySQL 已启动"
        else
            log_error "MySQL 无法连接，请检查 MySQL 服务是否运行"
            exit 1
        fi
    fi
else
    log_warn "未找到 mysqladmin，尝试通过端口检查 MySQL..."
    if ss -tlnp 2>/dev/null | grep -q "$MYSQL_PORT" || netstat -tlnp 2>/dev/null | grep -q "$MYSQL_PORT"; then
        log_info "MySQL 端口 $MYSQL_PORT 已监听"
    else
        log_error "MySQL 端口 $MYSQL_PORT 未监听，请先启动 MySQL"
        exit 1
    fi
fi

# ---------- 2. 后端依赖 ----------
log_step 2 $TOTAL_STEPS "编译后端 (Maven)..."
cd "$BACKEND_DIR"
MVN_CMD="mvn"
if ! command -v mvn &>/dev/null; then
    if [ -f "./mvnw" ]; then
        MVN_CMD="./mvnw"
        log_warn "使用 mvnw 替代 mvn"
    else
        log_error "未找到 Maven，请安装 Maven 3.6+"
        exit 1
    fi
fi
echo "   → $MVN_CMD compile..."
$MVN_CMD compile -q -DskipTests 2>&1 | tail -5 || {
    log_error "后端编译失败，请检查 pom.xml"
    exit 1
}
log_info "后端编译成功"
cd "$PROJECT_DIR"

# ---------- 3. 前端依赖 ----------
log_step 3 $TOTAL_STEPS "检查前端依赖..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "   → 安装 npm 依赖..."
    cd "$FRONTEND_DIR"
    npm install --loglevel=error 2>&1 | tail -5 || {
        log_error "npm install 失败"
        exit 1
    }
    cd "$PROJECT_DIR"
fi
log_info "前端依赖就绪"

# ---------- 4. 启动后端 ----------
log_step 4 $TOTAL_STEPS "启动后端服务 (端口 $BACKEND_PORT)..."
cd "$BACKEND_DIR"
$MVN_CMD spring-boot:run -q > /tmp/backend-${$}.log 2>&1 &
BACKEND_PID=$!
echo "   → PID: $BACKEND_PID"
cd "$PROJECT_DIR"

# 等待后端就绪
echo "   → 等待后端启动..."
BACKEND_READY=false
for i in $(seq 1 30); do
    if curl -s "http://127.0.0.1:$BACKEND_PORT" >/dev/null 2>&1; then
        BACKEND_READY=true
        break
    fi
    sleep 1
done

if $BACKEND_READY; then
    log_info "后端已启动 http://127.0.0.1:$BACKEND_PORT"
else
    log_error "后端启动超时，请检查日志: tail -50 /tmp/backend-${$}.log"
    exit 1
fi

# ---------- 5. 启动前端 ----------
log_step 5 $TOTAL_STEPS "启动前端服务 (端口 $FRONTEND_PORT)..."
cd "$FRONTEND_DIR"
npx vite --port "$FRONTEND_PORT" --host 0.0.0.0 > /tmp/frontend-${$}.log 2>&1 &
FRONTEND_PID=$!
echo "   → PID: $FRONTEND_PID"
cd "$PROJECT_DIR"

# 等待前端就绪
echo "   → 等待前端启动..."
FRONTEND_READY=false
for i in $(seq 1 15); do
    if curl -s "http://127.0.0.1:$FRONTEND_PORT" >/dev/null 2>&1; then
        FRONTEND_READY=true
        break
    fi
    sleep 1
done

if $FRONTEND_READY; then
    log_info "前端已启动 http://localhost:$FRONTEND_PORT"
else
    log_warn "前端启动较慢，仍在加载中..."
fi

# ---------- 6. 完成 ----------
log_step 6 $TOTAL_STEPS "全部启动完成！"
separator

echo -e "  ${GREEN}🌐  前端:${NC}  http://localhost:$FRONTEND_PORT"
echo -e "  ${GREEN}🔧  后端:${NC}  http://127.0.0.1:$BACKEND_PORT"
echo -e "  ${GREEN}📊  数据库:${NC} $MYSQL_HOST:$MYSQL_PORT / $MYSQL_DB"
echo ""
echo -e "  ${YELLOW}📋  测试账号:${NC}"
echo -e "      管理员 → admin / admin123"
echo -e "      用户   → user   / user123"
echo ""
echo -e "  ${YELLOW}📋  管理后台:${NC}  http://localhost:$FRONTEND_PORT/admin"
separator

# 尝试打开浏览器
case "$(uname -s)" in
    Linux*|CYGWIN*|MINGW*|MSYS*)
        command -v xdg-open &>/dev/null && xdg-open "http://localhost:$FRONTEND_PORT" 2>/dev/null & ;;
    Darwin*)
        open "http://localhost:$FRONTEND_PORT" 2>/dev/null & ;;
esac

# 保持运行
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止所有服务${NC}"
wait

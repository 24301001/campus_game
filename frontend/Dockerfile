# ============================================
# Stage 1: Build the frontend with Node
# ============================================
FROM node:18-alpine AS builder

WORKDIR /build

# 强制重新构建（时间戳）
ARG BUILD_TIMESTAMP
ENV BUILD_TIMESTAMP=${BUILD_TIMESTAMP}

# 依赖层缓存
COPY package.json package-lock.json ./
RUN npm ci --loglevel=error

# 复制源码并构建
COPY . .
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# 时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ============================================
# Stage 1: Build the JAR with Maven
# ============================================
FROM eclipse-temurin:8-jdk-alpine AS builder

WORKDIR /build

# 安装 Maven
RUN apk add --no-cache maven

# 使用阿里云 Maven 镜像（国内更稳定）
COPY settings-docker.xml /root/.m2/settings.xml

# 复制 pom.xml 和源码
COPY pom.xml ./
COPY src ./src

# 打包（自动下载依赖 + 编译）
RUN mvn clean package -DskipTests -B

# ============================================
# Stage 2: Run (需要 JDK 而不是 JRE，因判题功能需编译用户代码)
# ============================================
FROM eclipse-temurin:8-jdk-alpine AS runtime

WORKDIR /app

# 时区
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 从 builder 阶段复制 JAR
COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8081

# 优先使用环境变量覆盖数据库配置（在 docker-compose 中设置）
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
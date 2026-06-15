# Deployment Architecture
## Production Infrastructure Design

---

## 1. Infrastructure Overview

```
Internet
    │
    ▼
Cloudflare (DNS + DDoS Protection + CDN)
    │
    ▼
VPS Server (Ubuntu 22.04 LTS)
    │
    ▼
Nginx (SSL Termination + Reverse Proxy + Rate Limiting)
    │
    ├──▶ frontend:3000  (Next.js)
    └──▶ backend:8080   (Spring Boot)
              │
              ├──▶ postgres:5432  (PostgreSQL 16)
              └──▶ redis:6379     (Redis 7)
```

---

## 2. Docker Compose — Development

```yaml
# docker-compose.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: timetable_postgres
    environment:
      POSTGRES_DB: timetable_db
      POSTGRES_USER: timetable_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U timetable_user -d timetable_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - timetable_net

  redis:
    image: redis:7-alpine
    container_name: timetable_redis
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - timetable_net

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: timetable_backend
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/timetable_db
      SPRING_DATASOURCE_USERNAME: timetable_user
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      SPRING_REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION_MS: 900000
      JWT_REFRESH_EXPIRATION_MS: 604800000
      MAIL_HOST: ${MAIL_HOST}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_USERNAME: ${MAIL_USERNAME}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - timetable_net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: timetable_frontend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8080
      NEXT_PUBLIC_APP_NAME: "Smart Jadval"
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - timetable_net

  nginx:
    image: nginx:alpine
    container_name: timetable_nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    networks:
      - timetable_net

volumes:
  postgres_data:
  redis_data:

networks:
  timetable_net:
    driver: bridge
```

---

## 3. Docker Compose — Production

```yaml
# docker-compose.prod.yml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: timetable_postgres_prod
    environment:
      POSTGRES_DB: timetable_db
      POSTGRES_USER: timetable_user
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/postgresql.conf:/etc/postgresql/postgresql.conf
    restart: unless-stopped
    networks:
      - timetable_net
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.5'

  redis:
    image: redis:7-alpine
    container_name: timetable_redis_prod
    command: redis-server /etc/redis/redis.conf
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/etc/redis/redis.conf:ro
    restart: unless-stopped
    networks:
      - timetable_net
    deploy:
      resources:
        limits:
          memory: 512M

  backend:
    image: ghcr.io/your-org/timetable-backend:${VERSION}
    container_name: timetable_backend_prod
    environment:
      SPRING_PROFILES_ACTIVE: prod
    env_file: .env.prod
    secrets:
      - postgres_password
      - jwt_secret
      - mail_password
    restart: unless-stopped
    networks:
      - timetable_net
    deploy:
      resources:
        limits:
          memory: 3G
          cpus: '2.0'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    image: ghcr.io/your-org/timetable-frontend:${VERSION}
    container_name: timetable_frontend_prod
    env_file: .env.frontend.prod
    restart: unless-stopped
    networks:
      - timetable_net
    deploy:
      resources:
        limits:
          memory: 512M

  nginx:
    image: nginx:alpine
    container_name: timetable_nginx_prod
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - certbot_data:/var/www/certbot:ro
      - certbot_certs:/etc/letsencrypt:ro
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    networks:
      - timetable_net

  certbot:
    image: certbot/certbot
    volumes:
      - certbot_data:/var/www/certbot
      - certbot_certs:/etc/letsencrypt
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

  backup:
    image: postgres:16-alpine
    container_name: timetable_backup
    environment:
      PGHOST: postgres
      PGUSER: timetable_user
    volumes:
      - ./backups:/backups
      - ./scripts/backup.sh:/backup.sh
    command: /bin/sh -c "while :; do sleep 86400; /backup.sh; done"
    networks:
      - timetable_net

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  mail_password:
    file: ./secrets/mail_password.txt

volumes:
  postgres_data:
  redis_data:
  certbot_data:
  certbot_certs:

networks:
  timetable_net:
    driver: bridge
```

---

## 4. Nginx Configuration

```nginx
# nginx/nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent"';
    access_log /var/log/nginx/access.log main;
    error_log  /var/log/nginx/error.log warn;

    # Performance
    sendfile           on;
    tcp_nopush         on;
    tcp_nodelay        on;
    keepalive_timeout  65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript
               application/x-javascript text/xml application/xml image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=10r/m;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # HTTP → HTTPS redirect
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # Main HTTPS server
    server {
        listen 443 ssl http2;
        server_name timetable.school.uz;

        # SSL
        ssl_certificate     /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols       TLSv1.2 TLSv1.3;
        ssl_ciphers         ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        ssl_session_cache   shared:SSL:10m;
        ssl_session_timeout 1d;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Content Security Policy
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

        # Frontend (Next.js)
        location / {
            proxy_pass         http://frontend:3000;
            proxy_http_version 1.1;
            proxy_set_header   Upgrade $http_upgrade;
            proxy_set_header   Connection 'upgrade';
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # API (Spring Boot)
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass         http://backend:8080;
            proxy_http_version 1.1;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $scheme;
            proxy_read_timeout 120s;   # Allow solver long polling
        }

        # Auth endpoints — stricter rate limit
        location /api/v1/auth/login {
            limit_req zone=auth burst=5 nodelay;
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
        }

        # Health check
        location /health {
            proxy_pass http://backend:8080/actuator/health;
            access_log off;
        }

        # Static Next.js assets with caching
        location /_next/static/ {
            proxy_pass http://frontend:3000;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 5. Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Xms512m", "-Xmx2g", \
            "-XX:+UseG1GC", "-XX:MaxGCPauseMillis=200", \
            "/app/app.jar"]
```

---

## 6. Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 7. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Run backend tests
        working-directory: ./backend
        run: ./mvnw test
        env:
          SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/test_db
          SPRING_DATASOURCE_USERNAME: test_user
          SPRING_DATASOURCE_PASSWORD: test_pass

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - name: Install and test
        working-directory: ./frontend
        run: |
          npm ci
          npm run type-check
          npm run lint
          npm run build

  build-and-push:
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:latest
      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ghcr.io/${{ github.repository }}/frontend:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/timetable
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d --no-build
            docker system prune -f
```

---

## 8. Backup Strategy

```bash
#!/bin/bash
# scripts/backup.sh
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/timetable_$DATE.sql.gz"

pg_dump -Fc timetable_db | gzip > "$BACKUP_FILE"

# Retain last 30 days
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

# Upload to remote storage (optional)
# rclone copy "$BACKUP_FILE" remote:backups/timetable/
echo "Backup completed: $BACKUP_FILE"
```

---

## 9. VPS Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 4 cores | 8 cores |
| RAM | 8 GB | 16 GB |
| Storage | 50 GB SSD | 100 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Network | 100 Mbps | 1 Gbps |

### Memory Allocation
```
PostgreSQL:    2 GB
Redis:         512 MB
Backend JVM:   2-3 GB (solver needs memory)
Frontend:      512 MB
Nginx:         128 MB
OS overhead:   1 GB
Total:        ~7 GB → need 8 GB minimum, 16 GB recommended
```

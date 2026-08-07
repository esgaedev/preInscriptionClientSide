# syntax=docker/dockerfile:1.4
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Vite bakes VITE_* variables into the JS bundle at build time — they must be
# passed in as a build arg, not a runtime environment variable. In Dokploy,
# an Environment-tab variable of the same name is auto-forwarded as a build
# arg for Dockerfile-based apps.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY --from=build /app/dist /usr/share/nginx/html

# No API reverse-proxy anymore: the frontend calls VITE_API_BASE_URL
# directly, so nginx only needs to serve the static SPA build.
RUN <<'EOF' cat > /etc/nginx/conf.d/default.conf
server {
    listen 8030;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location = /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 "ok";
    }

    location / {
        try_files $uri /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 8030

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8030/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

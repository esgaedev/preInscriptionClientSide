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

# Install curl and envsubst for runtime config
RUN apk add --no-cache curl gettext

COPY --from=build /app/dist /usr/share/nginx/html

# Runtime config: nginx template with environment variable substitution
ENV API_BACKEND_URL=http://172.16.0.151
RUN <<'EOF' cat > /etc/nginx/conf.d/default.conf.template
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

    # Proxy API requests to backend
    location /API/ {
        proxy_pass ${API_BACKEND_URL}/API/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (add them since backend doesn't)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
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

# Create entrypoint script to substitute environment variables
RUN <<'EOF' cat > /docker-entrypoint.sh
#!/bin/sh
# Substitute environment variables in nginx config
export API_BACKEND_URL=${API_BACKEND_URL:-http://172.16.0.151}
envsubst '${API_BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
EOF
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8030

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8030/health || exit 1

CMD ["/docker-entrypoint.sh"]

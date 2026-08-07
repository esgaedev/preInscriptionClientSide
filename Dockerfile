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

# Copy config template
COPY public/config.js /usr/share/nginx/html/config.js.template

# Runtime config: use envsubst in entrypoint script
ENV API_BASE_URL=http://172.16.0.151
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

# Create entrypoint script to substitute environment variables
RUN <<'EOF' cat > /docker-entrypoint.sh
#!/bin/sh
# Replace ${API_BASE_URL} with actual environment variable value
export API_BASE_URL=${API_BASE_URL:-http://172.16.0.151}
envsubst '${API_BASE_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js
exec nginx -g 'daemon off;'
EOF
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8030

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8030/health || exit 1

CMD ["/docker-entrypoint.sh"]

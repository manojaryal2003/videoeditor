#!/bin/bash
# Run this ONCE on VPS after DNS is pointed to your server IP
# Usage: bash /opt/videoeditor/scripts/init-ssl.sh
set -e

DOMAIN="mirajaryal.com.np"
EMAIL="your-email@example.com"   # <-- Replace with your email

cd /opt/videoeditor

echo "=== Starting nginx (HTTP only, for ACME challenge) ==="
# Temporarily use a minimal nginx config that serves HTTP only
cat > /opt/videoeditor/nginx/nginx-init.conf <<'EOF'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        server_name mirajaryal.com.np www.mirajaryal.com.np;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'ok'; }
    }
}
EOF

docker run -d --rm \
  --name nginx-init \
  -p 80:80 \
  -v /opt/videoeditor/nginx/nginx-init.conf:/etc/nginx/nginx.conf:ro \
  -v certbot-www:/var/www/certbot \
  nginx:alpine

echo "=== Requesting SSL certificate ==="
docker run --rm \
  -v certbot-conf:/etc/letsencrypt \
  -v certbot-www:/var/www/certbot \
  certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

docker stop nginx-init

echo "=== SSL certificate obtained! Starting full stack ==="
docker compose -f docker-compose.prod.yml up -d

echo "=== Done! Visit https://$DOMAIN ==="

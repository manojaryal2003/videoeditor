#!/bin/bash
# Run this ONCE on your VPS to set up the server
# Usage: bash vps-setup.sh
set -e

echo "=== Installing Docker ==="
apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

systemctl enable docker
systemctl start docker

echo "=== Creating app directory ==="
mkdir -p /opt/videoeditor/nginx

echo "=== Docker installed ==="
docker --version
docker compose version

echo ""
echo "=== NEXT STEPS ==="
echo "1. Point mirajaryal.com.np DNS A record to this server's IP: $(curl -s ifconfig.me)"
echo "2. Push your code to GitHub and the CI/CD pipeline will deploy automatically"
echo "3. For the FIRST SSL certificate, run: bash /opt/videoeditor/scripts/init-ssl.sh"

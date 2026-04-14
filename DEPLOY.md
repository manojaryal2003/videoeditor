# Deployment Guide — mirajaryal.com.np

## Architecture

```
Internet → Nginx (80/443) → Client container (React/Nginx)
                          → Server container (Node/Express) → MongoDB Atlas
                                                            → Cloudinary
```

## One-time Setup

### 1. Create a Docker Hub account
Go to https://hub.docker.com and create a free account.

### 2. Create a GitHub repo and push code
```bash
cd "Video Editior"
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. Add GitHub Secrets
Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password |
| `VPS_HOST` | Your VPS IP address |
| `VPS_USER` | `root` (or your VPS username) |
| `VPS_SSH_KEY` | Your private SSH key (run `cat ~/.ssh/id_rsa`) |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your JWT secret |
| `JWT_EXPIRE` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `VITE_WHATSAPP_NUMBER` | `9867213265` |

### 4. Set up VPS
SSH into your VPS and run:
```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/scripts/vps-setup.sh | bash
```

### 5. Point DNS to VPS
In your domain registrar (for mirajaryal.com.np), add:
- `A` record: `@` → `YOUR_VPS_IP`
- `A` record: `www` → `YOUR_VPS_IP`

Wait for DNS propagation (usually 5–30 minutes).

### 6. Get SSL Certificate (run once on VPS)
```bash
# Edit the email in the script first
nano /opt/videoeditor/scripts/init-ssl.sh
bash /opt/videoeditor/scripts/init-ssl.sh
```

## Deploying Updates

Just push to `main`:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will automatically:
1. Build Docker images
2. Push to Docker Hub
3. SSH into your VPS and deploy the new images

## Useful VPS Commands

```bash
# View running containers
docker ps

# View logs
docker logs videoeditor-server -f
docker logs videoeditor-client -f
docker logs videoeditor-nginx -f

# Restart a service
docker compose -f /opt/videoeditor/docker-compose.prod.yml restart server

# Stop everything
docker compose -f /opt/videoeditor/docker-compose.prod.yml down

# Seed admin user (first time)
docker exec videoeditor-server node scripts/seedAdmin.js
```

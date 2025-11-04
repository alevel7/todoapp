#!/usr/bin/env bash
set -euo pipefail

echo " Installing Docker and Docker Compose on Ubuntu..."

# Update system packages
sudo apt update -y

# Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up the stable Docker APT repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine and CLI
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose plugin (official method)
sudo apt install -y docker-compose-plugin

sudo usermod -aG docker "$USER"

# Create deployment directory for your team's app
DEPLOY_DIR="$HOME/todoapp-deploy"
mkdir -p "$DEPLOY_DIR"

echo ""
echo "✅ Docker and Docker Compose installed successfully!"
echo "📁 Deployment directory created: $DEPLOY_DIR"
echo ""
echo "👉 Next steps:"
echo "1. Copy your 'deploy-docker-compose.yml' to this VM as:"
echo "   $DEPLOY_DIR/docker-compose.yml"
echo ""
echo "2. Then run:"
echo "   cd $DEPLOY_DIR && docker compose pull && docker compose up -d"
echo ""
echo "💡 Your team's images:"
echo "   - Frontend: alevel7/todo-frontend (port 3000)"
echo "   - Backend:  alevel7/todo-backend  (port 8080)"
echo ""
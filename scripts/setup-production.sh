#!/bin/bash

# Production setup script for Klario on Digital Ocean
# Run this script on your Digital Ocean droplet

set -e

echo "🚀 Klario Production Setup Script"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

print_status "Starting Klario production setup..."

# Update system
echo "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "2. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_status "Docker installed successfully"
else
    print_status "Docker is already installed"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "3. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_status "Docker Compose installed successfully"
else
    print_status "Docker Compose is already installed"
fi

# Install other useful tools
echo "4. Installing additional tools..."
sudo apt install -y curl wget git htop ncdu unzip postgresql-client

# Create application directory
echo "5. Setting up application directory..."
mkdir -p ~/klario
cd ~/klario

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    if [ -f env.production.template ]; then
        cp env.production.template .env
        print_warning ".env file created from template"
        print_warning "Please edit ~/klario/.env with your actual values before deploying!"
    else
        print_error "env.production.template not found. Please copy it from your development environment."
    fi
fi

# Set up log directory
sudo mkdir -p /var/log/caddy
sudo chown -R $USER:$USER /var/log/caddy

# Create systemd service for log rotation
echo "6. Setting up log rotation..."
sudo tee /etc/logrotate.d/klario << 'EOF'
/var/log/caddy/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 0644 www-data www-data
    postrotate
        docker kill --signal="USR1" klario-caddy 2>/dev/null || true
    endscript
}
EOF

# Configure firewall
echo "7. Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
print_status "Firewall configured"

# Set up automatic security updates
echo "8. Configuring automatic security updates..."
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -f noninteractive unattended-upgrades

# Create backup directory
mkdir -p ~/klario-backups

# Set up GitHub Actions secrets helper
cat > ~/setup-github-secrets.txt << 'EOF'
To complete the deployment setup, configure these GitHub Secrets:

Required secrets for GitHub Actions:
- DO_HOST: Your droplet's IP address
- DO_USERNAME: Your server username (usually root or your user)
- DO_SSH_KEY: Your private SSH key content
- DO_PORT: SSH port (usually 22)

Steps to add GitHub secrets:
1. Go to your GitHub repository
2. Click Settings > Secrets and variables > Actions
3. Click "New repository secret" for each secret above

Example SSH key generation (if needed):
ssh-keygen -t ed25519 -C "github-actions@klario"
# Copy the private key content for DO_SSH_KEY
# Add the public key to ~/.ssh/authorized_keys on this server
EOF

print_status "Production environment setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit ~/klario/.env with your actual configuration values"
echo "2. Configure GitHub Actions secrets (see ~/setup-github-secrets.txt)"
echo "3. Update Caddyfile with your actual domain name"
echo "4. Push your code to trigger the deployment"
echo ""
print_warning "Important: Log out and log back in for Docker group changes to take effect"
echo ""
echo "🔧 Useful commands:"
echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  - Restart services: docker-compose -f docker-compose.prod.yml restart"
echo "  - Check status: docker-compose -f docker-compose.prod.yml ps"
echo "  - Backup database: ./scripts/backup.sh"
echo ""
print_status "Setup complete! 🎉"
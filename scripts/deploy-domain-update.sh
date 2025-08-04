#!/bin/bash

# Quick Domain Update Deployment Script
# Updates production server with new domain configuration

set -e

# Configuration
NEW_DOMAIN="getklario.com"
SERVER_IP="46.101.67.240"
SERVER_USER="deployer"
PROJECT_PATH="/home/deployer/klario"

echo "🚀 Deploying domain update to production server..."
echo "   Domain: ${NEW_DOMAIN}"
echo "   Server: ${SERVER_IP}"

# Create temporary deployment package
echo "📦 Creating deployment package..."
mkdir -p /tmp/klario-domain-update
cp Caddyfile /tmp/klario-domain-update/
cp docker-compose.prod.yml /tmp/klario-domain-update/
cp env.production.template /tmp/klario-domain-update/
cp scripts/migrate-domain.sh /tmp/klario-domain-update/

# Create environment file with new domain
echo "🔧 Creating production environment file..."
cat > /tmp/klario-domain-update/.env << EOF
# Klario Production Environment - Domain Update
DOMAIN_NAME=${NEW_DOMAIN}
NODE_ENV=production

# Database Configuration (preserve existing)
POSTGRES_DB=klario
POSTGRES_USER=klario_user
POSTGRES_HOST_AUTH_METHOD=scram-sha-256
POSTGRES_INITDB_ARGS=--auth-host=scram-sha-256

# Application Configuration (preserve existing secrets)
# Note: Existing passwords and API keys will be preserved
EOF

echo "📤 Uploading files to server..."
scp -r /tmp/klario-domain-update/* ${SERVER_USER}@${SERVER_IP}:${PROJECT_PATH}/

echo "🔄 Executing domain migration on server..."
ssh ${SERVER_USER}@${SERVER_IP} << EOF
cd ${PROJECT_PATH}

# Make migration script executable
chmod +x migrate-domain.sh

# Backup current configuration
cp .env .env.backup.\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true

# Update domain in existing .env file
if [ -f .env ]; then
    # Preserve existing secrets, just update domain
    if grep -q "DOMAIN_NAME=" .env; then
        sed -i "s/DOMAIN_NAME=.*/DOMAIN_NAME=${NEW_DOMAIN}/" .env
    else
        echo "DOMAIN_NAME=${NEW_DOMAIN}" >> .env
    fi
    echo "✅ Updated existing .env file with new domain"
else
    echo "⚠️  No .env file found - this is expected for first deployment"
fi

# Update SendGrid from email if it exists
if grep -q "SENDGRID_FROM_EMAIL=" .env 2>/dev/null; then
    sed -i "s/SENDGRID_FROM_EMAIL=.*/SENDGRID_FROM_EMAIL=noreply@${NEW_DOMAIN}/" .env
    echo "✅ Updated SendGrid from email"
fi

# Stop and restart Caddy with new configuration
echo "🔄 Restarting Caddy with new domain..."
docker-compose -f docker-compose.prod.yml stop caddy || true
docker-compose -f docker-compose.prod.yml up -d caddy

# Wait for Caddy to start
sleep 5

# Test the new domain
echo "🧪 Testing new domain..."
curl -s -f http://${NEW_DOMAIN}/health > /dev/null 2>&1 && echo "✅ HTTP health check passed" || echo "⚠️  HTTP health check failed"

# Check SSL certificate provisioning
echo "🔒 SSL certificate will be automatically provisioned by Let's Encrypt"
echo "    This may take 1-5 minutes after DNS propagation completes"

echo ""
echo "🎉 Domain migration completed!"
echo "   New URL: https://${NEW_DOMAIN}"
echo "   Old URL will redirect: https://lkdevcontaineronline.online → https://${NEW_DOMAIN}"
echo ""
echo "⏱️  Please wait 1-5 minutes for SSL certificate provisioning"
EOF

# Cleanup
rm -rf /tmp/klario-domain-update

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🔍 Next steps:"
echo "   1. Wait 1-5 minutes for SSL certificate to provision"
echo "   2. Test: https://${NEW_DOMAIN}"
echo "   3. Verify old domain redirects work"
echo "   4. Test email sending with new domain"
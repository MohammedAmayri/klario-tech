#!/bin/bash

# Klario Domain Migration Script
# Safely migrates from old domain to new domain while preserving SendGrid SMTP

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OLD_DOMAIN="${OLD_DOMAIN:-lkdevcontaineronline.online}"
NEW_DOMAIN="${NEW_DOMAIN}"
DOCKER_COMPOSE_FILE="${DOCKER_COMPOSE_FILE:-docker-compose.prod.yml}"

echo -e "${BLUE}🔄 Klario Domain Migration Script${NC}"
echo -e "${BLUE}=================================${NC}"

# Validate inputs
if [[ -z "$NEW_DOMAIN" ]]; then
    echo -e "${RED}❌ Error: NEW_DOMAIN environment variable is required${NC}"
    echo "Usage: NEW_DOMAIN=yournewdomain.com ./scripts/migrate-domain.sh"
    exit 1
fi

echo -e "${YELLOW}📋 Migration Plan:${NC}"
echo -e "   Old Domain: ${OLD_DOMAIN}"
echo -e "   New Domain: ${NEW_DOMAIN}"
echo ""

# Step 1: Backup current configuration
echo -e "${BLUE}📦 Step 1: Backing up current configuration...${NC}"
cp Caddyfile Caddyfile.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✅ Configuration backed up${NC}"

# Step 2: Update environment file
echo -e "${BLUE}🔧 Step 2: Updating environment configuration...${NC}"
if [[ -f ".env" ]]; then
    # Update existing .env file
    if grep -q "DOMAIN_NAME=" .env; then
        sed -i "s/DOMAIN_NAME=.*/DOMAIN_NAME=${NEW_DOMAIN}/" .env
    else
        echo "DOMAIN_NAME=${NEW_DOMAIN}" >> .env
    fi
    echo -e "${GREEN}✅ Updated .env file${NC}"
else
    echo -e "${YELLOW}⚠️  No .env file found. Please create one with DOMAIN_NAME=${NEW_DOMAIN}${NC}"
fi

# Step 3: Update SendGrid configuration if needed
echo -e "${BLUE}📧 Step 3: Checking SendGrid configuration...${NC}"
if grep -q "SENDGRID_FROM_EMAIL=" .env 2>/dev/null; then
    current_email=$(grep "SENDGRID_FROM_EMAIL=" .env | cut -d'=' -f2)
    if [[ "$current_email" == *"$OLD_DOMAIN"* ]]; then
        new_email=$(echo "$current_email" | sed "s/$OLD_DOMAIN/$NEW_DOMAIN/g")
        sed -i "s/SENDGRID_FROM_EMAIL=.*/SENDGRID_FROM_EMAIL=${new_email}/" .env
        echo -e "${GREEN}✅ Updated SendGrid from email to: ${new_email}${NC}"
        echo -e "${YELLOW}⚠️  Important: Update this email address in your SendGrid dashboard${NC}"
    fi
fi

# Step 4: Restart Caddy with new configuration
echo -e "${BLUE}🔄 Step 4: Restarting Caddy with new domain...${NC}"
if command -v docker-compose &> /dev/null && [[ -f "$DOCKER_COMPOSE_FILE" ]]; then
    # Load environment variables
    export DOMAIN_NAME="$NEW_DOMAIN"
    
    echo -e "${YELLOW}   Stopping Caddy...${NC}"
    docker-compose -f "$DOCKER_COMPOSE_FILE" stop caddy
    
    echo -e "${YELLOW}   Starting Caddy with new domain...${NC}"
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d caddy
    
    echo -e "${GREEN}✅ Caddy restarted with new domain${NC}"
else
    echo -e "${YELLOW}⚠️  Docker Compose not found. Please restart Caddy manually.${NC}"
fi

# Step 5: Test new domain
echo -e "${BLUE}🧪 Step 5: Testing new domain...${NC}"
sleep 10  # Wait for Caddy to start

if curl -s -f "https://${NEW_DOMAIN}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ New domain is responding correctly${NC}"
elif curl -s -f "http://${NEW_DOMAIN}/health" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Domain responding on HTTP (SSL certificate may still be provisioning)${NC}"
else
    echo -e "${RED}❌ New domain not responding. Please check DNS configuration.${NC}"
fi

# Step 6: Verify redirects
echo -e "${BLUE}🔀 Step 6: Testing domain redirects...${NC}"
if curl -s -I "http://${OLD_DOMAIN}/" | grep -q "301\|302"; then
    echo -e "${GREEN}✅ Old domain redirects are working${NC}"
else
    echo -e "${YELLOW}⚠️  Old domain redirects may not be working yet${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Domain migration completed!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "   1. Update DNS A record: ${NEW_DOMAIN} → $(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo -e "   2. Wait for DNS propagation (up to 48 hours)"
echo -e "   3. Verify SendGrid email sending with new domain"
echo -e "   4. Update any hardcoded domain references in your application"
echo -e "   5. After 7 days, remove old domain redirects from Caddyfile"
echo ""
echo -e "${YELLOW}💡 SendGrid SMTP Integration:${NC}"
echo -e "   - Your SendGrid subdomain DNS records remain intact"
echo -e "   - SMTP authentication continues to work with existing credentials"
echo -e "   - Only update 'From' email addresses to use new domain if desired"
echo ""
echo -e "${BLUE}📞 Need help? Check the deployment documentation or contact support.${NC}"
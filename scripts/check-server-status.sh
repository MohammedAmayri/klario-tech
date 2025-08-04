#!/bin/bash

# Server Status Check Script
# Run this on your Digital Ocean droplet to diagnose domain and SSL issues

echo "🔍 Klario Server Status Check"
echo "============================"

# Check if we're on the server
if [ "$(whoami)" != "deployer" ] && [ "$(whoami)" != "root" ]; then
    echo "ℹ️  This script should be run on your Digital Ocean server"
    echo "   SSH command: ssh deployer@46.101.67.240"
    exit 1
fi

# Navigate to project directory
cd /home/deployer/klario || cd /root/klario || {
    echo "❌ Klario project directory not found"
    exit 1
}

echo "📁 Current directory: $(pwd)"
echo ""

# Check Docker containers
echo "🐳 Docker Container Status:"
echo "-------------------------"
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.prod.yml ps
else
    docker ps --filter "name=klario"
fi
echo ""

# Check environment configuration
echo "🔧 Environment Configuration:"
echo "----------------------------"
if [ -f .env ]; then
    echo "✅ .env file exists"
    grep "DOMAIN_NAME" .env || echo "⚠️  DOMAIN_NAME not set in .env"
    grep "SENDGRID_FROM_EMAIL" .env || echo "ℹ️  SendGrid not configured"
else
    echo "❌ .env file missing"
fi
echo ""

# Check Caddy configuration
echo "🌐 Caddy Configuration:"
echo "----------------------"
if [ -f Caddyfile ]; then
    echo "✅ Caddyfile exists"
    grep -A 5 "getklario.com\|DOMAIN_NAME" Caddyfile | head -10
else
    echo "❌ Caddyfile missing"
fi
echo ""

# Check Caddy logs
echo "📋 Caddy Logs (last 20 lines):"
echo "------------------------------"
docker-compose -f docker-compose.prod.yml logs --tail=20 caddy 2>/dev/null || echo "Could not retrieve Caddy logs"
echo ""

# Test local connectivity
echo "🧪 Local Connectivity Tests:"
echo "---------------------------"
echo "Testing HTTP on port 5000 (app):"
curl -s -w "Status: %{http_code}\n" http://localhost:5000/health || echo "❌ App not responding on port 5000"

echo "Testing HTTP on port 80 (Caddy):"
curl -s -w "Status: %{http_code}\n" http://localhost/health || echo "❌ Caddy not responding on port 80"

echo "Testing HTTPS on port 443 (Caddy):"
curl -k -s -w "Status: %{http_code}\n" https://localhost/health || echo "❌ Caddy not responding on port 443"
echo ""

# Check SSL certificate
echo "🔒 SSL Certificate Status:"
echo "-------------------------"
# Check if SSL certificate exists for getklario.com
if docker-compose -f docker-compose.prod.yml exec -T caddy ls /data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/getklario.com/ 2>/dev/null; then
    echo "✅ SSL certificate found for getklario.com"
else
    echo "❌ No SSL certificate found for getklario.com"
fi

# Check Let's Encrypt logs
echo ""
echo "📜 Recent SSL Certificate Logs:"
echo "------------------------------"
docker-compose -f docker-compose.prod.yml logs caddy 2>/dev/null | grep -i "certificate\|acme\|getklario" | tail -10 || echo "No certificate logs found"
echo ""

# Network diagnostics
echo "🌍 Network Diagnostics:"
echo "----------------------"
echo "Server IP Address:"
curl -s ifconfig.me 2>/dev/null || echo "Could not determine external IP"

echo ""
echo "DNS Resolution Test (from server):"
nslookup getklario.com 2>/dev/null || dig getklario.com +short 2>/dev/null || echo "DNS lookup failed - install bind-utils/dnsutils"

echo ""
echo "Port Status:"
netstat -tlnp | grep ":80\|:443\|:5000" 2>/dev/null || ss -tlnp | grep ":80\|:443\|:5000" || echo "Could not check port status"

echo ""
echo "🎯 Quick Fix Commands:"
echo "====================="
echo "If Caddy isn't working:"
echo "  docker-compose -f docker-compose.prod.yml restart caddy"
echo ""
echo "If containers aren't running:"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "To check detailed logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f caddy"
echo ""
echo "To force SSL certificate refresh:"
echo "  docker-compose -f docker-compose.prod.yml exec caddy caddy reload --config /etc/caddy/Caddyfile"
#!/bin/bash

# Fix SSL Certificate for getklario.com
# This script runs Caddy admin commands from inside the container

set -e

echo "🔧 Fixing SSL Certificate for getklario.com"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found. Run this from /home/deployer/klario/"
    exit 1
fi

# Check if Caddy container is running
if ! docker-compose -f docker-compose.prod.yml ps caddy | grep -q "Up"; then
    echo "❌ Caddy container is not running. Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    sleep 10
fi

echo "📋 Current Caddy container status:"
docker-compose -f docker-compose.prod.yml ps caddy

echo ""
echo "🔄 Reloading Caddy configuration with proper site binding..."

# Reload Caddy configuration (this will trigger SSL certificate request)
docker-compose -f docker-compose.prod.yml exec -T caddy caddy reload --config /etc/caddy/Caddyfile

echo ""
echo "⏱️  Waiting for SSL certificate provisioning..."
sleep 15

echo ""
echo "🔍 Checking SSL certificate status (from inside container)..."
docker-compose -f docker-compose.prod.yml exec -T caddy caddy list-certificates

echo ""
echo "📋 Recent Caddy logs (SSL certificate attempts):"
docker-compose -f docker-compose.prod.yml logs --tail=30 caddy | grep -i "certificate\|acme\|getklario\|tls"

echo ""
echo "🧪 Testing HTTPS connection..."
# Test from inside the container network
if docker-compose -f docker-compose.prod.yml exec -T caddy curl -k -s -w "Status: %{http_code}\n" https://localhost/health; then
    echo "✅ HTTPS working inside container"
else
    echo "❌ HTTPS not working inside container"
fi

# Test external connection (this might fail due to DNS)
echo ""
echo "🌐 Testing external DNS resolution..."
if docker-compose -f docker-compose.prod.yml exec -T caddy nslookup getklario.com; then
    echo "✅ DNS resolving inside container"
    echo ""
    echo "🎯 Testing full HTTPS chain..."
    docker-compose -f docker-compose.prod.yml exec -T caddy curl -s -w "Status: %{http_code}\n" https://getklario.com/health || echo "⚠️  External HTTPS test failed (DNS propagation issue)"
else
    echo "❌ DNS not resolving - this is likely the root cause"
    echo "   The SSL certificate cannot be issued until DNS propagates"
fi

echo ""
echo "📊 Summary:"
echo "==========="
echo "1. ✅ Caddy configuration reloaded with proper getklario.com site binding"
echo "2. 🔍 SSL certificate request should now be triggered"
echo "3. ⏱️  Wait 5-10 minutes for Let's Encrypt certificate issuance"
echo "4. 🌐 DNS propagation may take longer (check dnschecker.org)"
echo ""
echo "💡 Next steps:"
echo "   - Monitor Caddy logs: docker-compose -f docker-compose.prod.yml logs -f caddy"
echo "   - Check DNS propagation: https://dnschecker.org/"
echo "   - Test again in 10 minutes: curl -v https://getklario.com/health"
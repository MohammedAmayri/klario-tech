#!/bin/bash

# Debug Caddy Configuration and Force SSL Certificate Issuance
# This script follows the exact steps from the diagnosis

set -e

echo "=== Caddy SSL Certificate Debug & Fix ==="
echo "========================================"

# Step 1: Inspect Caddy's live effective config
echo "1. Inspecting Caddy's loaded configuration..."
echo "--------------------------------------------"
docker exec caddy-proxy curl -s localhost:2019/config/ | head -500

echo ""
echo ""

# Step 2: Format and reload Caddyfile
echo "2. Formatting and reloading Caddyfile..."
echo "---------------------------------------"
docker exec caddy-proxy caddy fmt --overwrite /etc/caddy/Caddyfile
docker exec caddy-proxy caddy reload --config /etc/caddy/Caddyfile

echo ""

# Step 3: Restart Caddy to force fresh TLS evaluation
echo "3. Restarting Caddy for fresh TLS evaluation..."
echo "----------------------------------------------"
docker restart caddy-proxy

# Wait for container to restart
echo "Waiting for Caddy to restart..."
sleep 15

# Step 4: Trigger ACME issuance with HTTP request
echo ""
echo "4. Triggering ACME certificate issuance..."
echo "-----------------------------------------"
echo "Making HTTP request to trigger certificate acquisition:"
curl -v http://getklario.com/health 2>&1 | head -20 || echo "HTTP request completed (may have failed due to DNS)"

echo ""
echo ""

# Step 5: Check logs for certificate acquisition
echo "5. Checking Caddy logs for certificate attempts..."
echo "-------------------------------------------------"
docker logs --tail=80 caddy-proxy | grep -E "(certificate|acme|tls|getklario)" || echo "No certificate-related logs found"

echo ""
echo ""

# Step 6: Test HTTPS connections
echo "6. Testing HTTPS connections..."
echo "------------------------------"
echo "Testing getklario.com:"
curl -v https://getklario.com/health 2>&1 | head -10 || echo "HTTPS test failed for getklario.com"

echo ""
echo "Testing www.getklario.com:"
curl -v https://www.getklario.com/health 2>&1 | head -10 || echo "HTTPS test failed for www.getklario.com"

echo ""
echo ""

# Step 7: Check certificate details
echo "7. Certificate details (if available)..."
echo "---------------------------------------"
echo | openssl s_client -connect getklario.com:443 -servername getklario.com 2>/dev/null | openssl x509 -noout -text | head -20 || echo "Could not retrieve certificate details"

echo ""
echo ""

# Summary
echo "=== SUMMARY ==="
echo "=============="
echo "1. ✅ Inspected Caddy configuration"
echo "2. ✅ Formatted and reloaded Caddyfile"
echo "3. ✅ Restarted Caddy container"
echo "4. ⏱️  Triggered ACME certificate request"
echo "5. 📋 Checked logs for certificate activity"
echo "6. 🧪 Tested HTTPS connections"
echo ""
echo "If certificates still aren't working:"
echo "- Check DNS propagation: https://dnschecker.org/"
echo "- Verify A record: getklario.com → $(curl -s ifconfig.me || echo 'YOUR_SERVER_IP')"
echo "- Monitor logs: docker logs -f caddy-proxy"
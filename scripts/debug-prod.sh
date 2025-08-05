#!/bin/bash

echo "=== Container Status ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n=== Klario App Logs ==="
docker logs klario-app --tail 20 2>&1 | grep -E "(error|Error|ERROR|failed|Failed|FAILED)" || docker logs klario-app --tail 10

echo -e "\n=== PostgreSQL Logs ==="
docker logs klario-postgres --tail 10 2>&1

echo -e "\n=== Redis Logs ==="
docker logs klario-redis --tail 10 2>&1

echo -e "\n=== Environment Check ==="
if [ -f ~/klario/.env ]; then
    echo "✅ .env file exists with $(wc -l < ~/klario/.env) lines"
    echo "Environment variables defined:"
    grep -E "^[A-Z_]+=" ~/klario/.env | cut -d= -f1
else
    echo "❌ .env file not found!"
fi

echo -e "\n=== Docker Compose Status ==="
cd ~/klario && docker-compose -f docker-compose.prod.yml ps
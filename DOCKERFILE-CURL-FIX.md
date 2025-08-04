# 🚨 CRITICAL: Add curl to Docker Image

## Issue
GitHub Actions health check failing because Alpine Node.js image doesn't include curl:
```bash
docker-compose exec -T klario-app curl -f http://localhost:5000/health
# Result: exec: "curl": executable file not found in $PATH
```

## Fix Applied ✅
Updated Dockerfile to install curl in the runner stage:

```dockerfile
# Production image
FROM base AS runner
WORKDIR /app

# Install curl for health checks before switching to non-root user
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser
```

## Deploy This Fix
```bash
git add -A
git commit -m "Add curl to production Docker image for health checks"
git push origin main
```

## Expected Results
1. ✅ Docker image builds with curl available
2. ✅ Health check passes: `curl http://localhost:5000/health` works inside container
3. ✅ Caddy upstream health checks succeed
4. ✅ GitHub Actions deployment completes successfully
5. ✅ SSL certificate provisions for getklario.com

**Status: Ready for deployment** 🚀
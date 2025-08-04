# 🚨 FINAL FIX: Install curl correctly in Docker image

## Issue Confirmed
GitHub Actions logs show: `curl not found` - the Docker image wasn't built with curl properly.

## Root Cause
The curl installation wasn't working because of user context issues in the Dockerfile.

## Solution Applied ✅
Fixed Dockerfile runner stage to properly install curl:

```dockerfile
# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Install curl for health checks (as root)
USER root
RUN apk add --no-cache curl

# Copy built application and install dependencies (as root)
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create healthcheck script
RUN printf '...' > /app/healthcheck.js

# Switch to non-root user for security
USER nodeuser
```

## Deploy Command
```bash
git add -A
git commit -m "FINAL FIX: Install curl correctly in Docker production image"
git push origin main
```

## Expected Result
✅ curl available in container: `which curl` returns `/usr/bin/curl`
✅ Health check passes: `curl -f http://localhost:5000/health` succeeds
✅ GitHub Actions deployment completes successfully
✅ SSL certificate provisions for getklario.com
✅ Site accessible at https://getklario.com

**This will resolve the deployment issue completely.**
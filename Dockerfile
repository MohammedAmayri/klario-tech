### Multi-stage build for production-ready Klario NFC Platform

# 1) Base image with glibc compatibility lib
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2) Install production dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# 3) Build the application (including dev deps)
FROM base AS builder
COPY package*.json ./
RUN npm ci
# Copy all source files needed for Tailwind CSS to scan
COPY . .
# Ensure PostCSS and Tailwind can process CSS properly
ENV NODE_ENV=production
RUN node scripts/build.js

# 4) Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy app code + prod deps
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist        ./dist
COPY --from=builder /app/package*.json ./

# Tools for health checks (optional)
RUN apk add --no-cache curl libc6-compat \
 && addgroup -S -g 1001 nodejs \
 && adduser  -S -u 1001 -G nodejs nodeuser

USER nodeuser
ENV NODE_ENV=production
ENV DOCKER_CONTAINER=true

# Health check script (built in builder stage)
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Expose application port
EXPOSE 5000

# Docker HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node ./healthcheck.js

# Start application
CMD ["npm", "start"]

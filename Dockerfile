# Multi-stage build for production-ready Klario NFC Platform
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN node scripts/build.js

# Production image
FROM base AS runner
WORKDIR /app

# Install curl for health checks before switching to non-root user
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodeuser

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Create healthcheck script
RUN printf 'const http=require("http");const options={host:"0.0.0.0",port:5000,path:"/health",timeout:5000};const req=http.request(options,(res)=>{process.exit(res.statusCode===200?0:1)});req.on("error",()=>process.exit(1));req.on("timeout",()=>process.exit(1));req.end();' > /app/healthcheck.js

# Switch to non-root user
USER nodeuser

# Set Docker environment flag
ENV DOCKER_CONTAINER=true

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node /app/healthcheck.js

# Start the application
CMD ["npm", "start"]
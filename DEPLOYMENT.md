# Klario Production Deployment Guide

This guide will help you deploy Klario to production using Docker, Docker Compose, and GitHub Actions on a Digital Ocean droplet.

## Architecture Overview

Our production architecture consists of:

1. **Caddy** - Reverse proxy with automatic SSL/TLS termination
2. **Klario App** - Node.js application container
3. **PostgreSQL** - Database container with persistent storage
4. **Redis** - Session storage and caching (optional but recommended)
5. **Backup Service** - Automated daily database backups

## Prerequisites

- Digital Ocean droplet (minimum 2GB RAM, 2 vCPUs recommended)
- Domain name pointed to your droplet's IP
- GitHub repository with your Klario code
- Docker and Docker Compose installed on the server

## Quick Start

### 1. Server Setup

Run this on your Digital Ocean droplet:

```bash
# Download and run the setup script
curl -sSL https://raw.githubusercontent.com/yourusername/klario/main/scripts/setup-production.sh | bash

# Or manually:
git clone https://github.com/yourusername/klario.git ~/klario
cd ~/klario
chmod +x scripts/setup-production.sh
./scripts/setup-production.sh
```

### 2. Configure Environment Variables

Edit the `.env` file in `~/klario/`:

```bash
cd ~/klario
cp env.production.template .env
nano .env  # Edit with your actual values
```

Required environment variables:

```env
# Database
POSTGRES_PASSWORD=your_secure_db_password
POSTGRES_USER=klario_user
POSTGRES_DB=klario

# Redis
REDIS_PASSWORD=your_secure_redis_password

# Application
SESSION_SECRET=your_very_secure_session_secret_32_chars_minimum
NODE_ENV=production

# Email (choose one)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Or use SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMS
HELLOSMS_USERNAME=your_hellosms_username
HELLOSMS_PASSWORD=your_hellosms_password

# AI
OPENAI_API_KEY=your_openai_api_key

# Domain
DOMAIN_NAME=yourdomain.com
```

### 3. Update Domain Configuration

Edit the `Caddyfile` and replace `yourdomain.com` with your actual domain:

```bash
sed -i 's/yourdomain.com/your-actual-domain.com/g' ~/klario/Caddyfile
```

### 4. Set Up GitHub Actions

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

- `DO_HOST`: Your droplet's IP address
- `DO_USERNAME`: Your server username (usually your user or root)
- `DO_SSH_KEY`: Your private SSH key content
- `DO_PORT`: SSH port (usually 22)

### 5. Deploy

Push your code to the main branch to trigger automatic deployment:

```bash
git push origin main
```

## Manual Deployment (Alternative)

If you prefer manual deployment without GitHub Actions:

```bash
# Build the Docker image
docker build -t klario:latest .

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f klario-app
```

## Database Migration

### From Development to Production

1. Export your development database:
```bash
./scripts/migrate-from-development.sh
```

2. Copy the backup file to your production server:
```bash
scp migration-backups/development_export_*.sql user@your-server:~/klario/
```

3. On the production server, load the data:
```bash
cd ~/klario

# Stop the app
docker-compose -f docker-compose.prod.yml stop klario-app

# Load the backup
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U klario_user -d klario < development_export_*.sql

# Start the app
docker-compose -f docker-compose.prod.yml up -d
```

### Schema Updates

For schema changes, use Drizzle migrations:

```bash
# Generate migration
npm run db:generate

# Apply migration (in production)
docker-compose -f docker-compose.prod.yml exec klario-app npm run db:push
```

## Monitoring and Maintenance

### Health Checks

The application includes built-in health checks:

- Application health: `https://yourdomain.com/health`
- Caddy health: `http://your-server-ip:8080/caddy-health` (internal only)

### Logs

View logs for different services:

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f klario-app

# Database logs
docker-compose -f docker-compose.prod.yml logs -f postgres

# Caddy logs
docker-compose -f docker-compose.prod.yml logs -f caddy

# All services
docker-compose -f docker-compose.prod.yml logs -f
```

### Backups

Automated backups run daily. To manually create a backup:

```bash
docker-compose -f docker-compose.prod.yml exec db-backup /usr/local/bin/backup.sh
```

View available backups:

```bash
docker-compose -f docker-compose.prod.yml exec db-backup ls -la /backups/
```

Restore from backup:

```bash
# Stop the app
docker-compose -f docker-compose.prod.yml stop klario-app

# Restore (replace TIMESTAMP with actual timestamp)
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U klario_user -d klario < /backups/klario_backup_TIMESTAMP.sql

# Start the app
docker-compose -f docker-compose.prod.yml up -d
```

### Updates

To update the application:

1. **Via GitHub Actions** (recommended): Just push to main branch
2. **Manually**:
   ```bash
   # Pull latest code
   git pull origin main
   
   # Rebuild and restart
   docker build -t klario:latest .
   docker-compose -f docker-compose.prod.yml up -d --force-recreate klario-app
   ```

### Scaling

For high traffic, you can scale the application:

```bash
# Scale to 3 application instances
docker-compose -f docker-compose.prod.yml up -d --scale klario-app=3

# Update Caddy configuration for load balancing
# Edit Caddyfile to add multiple upstream servers
```

## Troubleshooting

### Common Issues

1. **Container fails to start**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs klario-app
   ```

2. **Database connection issues**:
   ```bash
   # Check if PostgreSQL is running
   docker-compose -f docker-compose.prod.yml ps postgres
   
   # Test connection
   docker-compose -f docker-compose.prod.yml exec postgres psql -U klario_user -d klario -c '\l'
   ```

3. **SSL certificate issues**:
   ```bash
   # Check Caddy logs
   docker-compose -f docker-compose.prod.yml logs caddy
   
   # Ensure domain DNS is correctly pointed to your server
   nslookup yourdomain.com
   ```

4. **Memory issues**:
   ```bash
   # Check system resources
   htop
   df -h
   
   # Clean up Docker
   docker system prune -f
   ```

### Performance Monitoring

Monitor your application performance:

```bash
# System resources
htop
free -h
df -h

# Docker stats
docker stats

# Application-specific metrics
curl https://yourdomain.com/health
```

## Security Considerations

1. **Firewall Configuration**:
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

2. **Regular Updates**:
   ```bash
   # System updates
   sudo apt update && sudo apt upgrade -y
   
   # Docker updates
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Secret Management**:
   - Never commit secrets to version control
   - Use strong passwords (minimum 32 characters)
   - Rotate secrets regularly
   - Use environment variables for all secrets

4. **SSL/TLS**:
   - Caddy automatically handles SSL certificates via Let's Encrypt
   - Certificates are automatically renewed
   - All traffic is redirected to HTTPS

## Support

For issues or questions:

1. Check the logs first
2. Review this documentation
3. Check GitHub Issues
4. Contact support at support@klario.com

## Files Overview

- `Dockerfile` - Multi-stage Docker build for the application
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `Caddyfile` - Reverse proxy and SSL configuration
- `.github/workflows/deploy.yml` - GitHub Actions deployment pipeline
- `scripts/setup-production.sh` - Server setup script
- `scripts/migrate-from-development.sh` - Database migration script
- `scripts/backup.sh` - Database backup script
- `env.production.template` - Environment variables template

This production setup is designed for reliability, security, and ease of maintenance. The architecture supports both small-scale deployments and can be scaled for larger traffic volumes.
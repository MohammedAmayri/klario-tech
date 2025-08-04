#!/bin/bash

# Klario Database Backup Script
# Runs daily via cron in Docker container

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
POSTGRES_HOST="postgres"
POSTGRES_DB=${POSTGRES_DB:-klario}
POSTGRES_USER=${POSTGRES_USER:-klario_user}
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
echo "Starting backup at $(date)"

# Full database backup
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB \
  --no-password --verbose --format=custom \
  > $BACKUP_DIR/klario_full_$DATE.dump

# Compress backup
gzip $BACKUP_DIR/klario_full_$DATE.dump

# Create schema-only backup (for development)
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB \
  --no-password --schema-only --verbose \
  > $BACKUP_DIR/klario_schema_$DATE.sql

gzip $BACKUP_DIR/klario_schema_$DATE.sql

# Create data-only backup
pg_dump -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB \
  --no-password --data-only --verbose --format=custom \
  > $BACKUP_DIR/klario_data_$DATE.dump

gzip $BACKUP_DIR/klario_data_$DATE.dump

# Remove old backups (keep last 30 days)
find $BACKUP_DIR -name "klario_*.gz" -mtime +$RETENTION_DAYS -delete

# Log backup completion
echo "Backup completed at $(date)"
echo "Backup files created:"
ls -la $BACKUP_DIR/*$DATE*

# Optional: Upload to cloud storage (uncomment if needed)
# aws s3 sync $BACKUP_DIR s3://klario-backups/$(date +%Y/%m/) --exclude "*" --include "*$DATE*"

# Health check - verify backup integrity
echo "Verifying backup integrity..."
gunzip -t $BACKUP_DIR/klario_full_$DATE.dump.gz
echo "✅ Backup integrity verified"

echo "Backup process completed successfully"
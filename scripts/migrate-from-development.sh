#!/bin/bash

# Migration script to export data from development/Replit to production
# This script helps you migrate your current development database to production

set -e

echo "🔄 Klario Database Migration Script"
echo "=================================="

# Configuration
BACKUP_DIR="./migration-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "1. Exporting development database..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Please set your development database URL:"
    echo "export DATABASE_URL='your_development_database_url'"
    exit 1
fi

# Export development data
echo "Creating development database backup..."
pg_dump "$DATABASE_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    > "$BACKUP_DIR/development_export_$TIMESTAMP.sql"

# Also create a data-only export (without schema)
pg_dump "$DATABASE_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --data-only \
    --column-inserts \
    > "$BACKUP_DIR/development_data_only_$TIMESTAMP.sql"

echo "✅ Development database exported successfully"
echo "   Full backup: $BACKUP_DIR/development_export_$TIMESTAMP.sql"
echo "   Data only: $BACKUP_DIR/development_data_only_$TIMESTAMP.sql"

echo ""
echo "2. Next steps for production deployment:"
echo "======================================="
echo ""
echo "a) Copy the backup files to your production server:"
echo "   scp $BACKUP_DIR/development_export_$TIMESTAMP.sql user@your-server:/path/to/klario/"
echo ""
echo "b) On your production server, load the data:"
echo "   # Stop the application"
echo "   docker-compose -f docker-compose.prod.yml stop klario-app"
echo ""
echo "   # Load the database backup"
echo "   docker-compose -f docker-compose.prod.yml exec -T postgres psql -U klario_user -d klario < development_export_$TIMESTAMP.sql"
echo ""
echo "   # Start the application"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "c) Verify the migration:"
echo "   curl http://your-domain.com/health"
echo ""
echo "📋 Migration files created in: $BACKUP_DIR"
echo ""
echo "⚠️  Important reminders:"
echo "   - Test the migration on a staging environment first"
echo "   - Ensure your production .env file has all required secrets"
echo "   - Update your DNS to point to the production server"
echo "   - Configure SSL certificates in Caddy"
echo ""

# Create a quick verification script
cat > "$BACKUP_DIR/verify-migration.sql" << 'EOF'
-- Quick verification queries for migration
-- Run these on your production database to verify the migration

-- Check if tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Count records in main tables
SELECT 'businesses' as table_name, COUNT(*) as count FROM businesses
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'campaigns' as table_name, COUNT(*) as count FROM campaigns
UNION ALL
SELECT 'sessions' as table_name, COUNT(*) as count FROM sessions;

-- Check for any issues
SELECT 'Migration verification completed' as status;
EOF

echo "📝 Verification script created: $BACKUP_DIR/verify-migration.sql"
echo "   Run this on production to verify the migration"
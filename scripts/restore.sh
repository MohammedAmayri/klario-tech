#!/bin/bash

# Klario Database Restore Script
# Usage: ./restore.sh <backup_file> [target_db]

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <backup_file> [target_db]"
    echo "Example: $0 klario_full_20250203_120000.dump.gz"
    echo "Example: $0 klario_full_20250203_120000.dump.gz klario_staging"
    exit 1
fi

BACKUP_FILE=$1
TARGET_DB=${2:-klario}
POSTGRES_HOST=${POSTGRES_HOST:-postgres}
POSTGRES_USER=${POSTGRES_USER:-klario}
BACKUP_DIR="/backups"

# Check if backup file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
    exit 1
fi

echo "🔄 Starting restore process..."
echo "Backup file: $BACKUP_FILE"
echo "Target database: $TARGET_DB"
echo "Postgres host: $POSTGRES_HOST"

# Extract file if it's compressed
TEMP_FILE="/tmp/restore_temp.dump"
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "📦 Extracting compressed backup..."
    gunzip -c "$BACKUP_DIR/$BACKUP_FILE" > $TEMP_FILE
else
    cp "$BACKUP_DIR/$BACKUP_FILE" $TEMP_FILE
fi

# Create target database if it doesn't exist
echo "🗄️  Ensuring target database exists..."
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $TARGET_DB;" 2>/dev/null || echo "Database $TARGET_DB already exists"

# Drop existing connections to target database
echo "🔌 Terminating existing connections..."
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = '$TARGET_DB' AND pid <> pg_backend_pid();"

# Restore database
echo "🔄 Restoring database..."
if [[ $BACKUP_FILE == *_full_* ]]; then
    # Full backup restore
    pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB \
        --clean --if-exists --no-owner --no-privileges \
        --verbose $TEMP_FILE
elif [[ $BACKUP_FILE == *_schema_* ]]; then
    # Schema-only restore
    psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB < $TEMP_FILE
elif [[ $BACKUP_FILE == *_data_* ]]; then
    # Data-only restore
    pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB \
        --data-only --disable-triggers --no-owner --no-privileges \
        --verbose $TEMP_FILE
else
    echo "⚠️  Unknown backup type, attempting full restore..."
    pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB \
        --clean --if-exists --no-owner --no-privileges \
        --verbose $TEMP_FILE
fi

# Clean up temporary file
rm -f $TEMP_FILE

# Verify restore
echo "✅ Verifying restore..."
TABLE_COUNT=$(psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB -t -c "
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';")

echo "Database $TARGET_DB restored with $TABLE_COUNT tables"

# Run any post-restore tasks
echo "🔧 Running post-restore tasks..."

# Update sequences (if needed)
psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $TARGET_DB -c "
DO \$\$
DECLARE
    seq_record RECORD;
BEGIN
    FOR seq_record IN 
        SELECT schemaname, sequencename, tablename, columnname
        FROM pg_sequences s
        JOIN information_schema.columns c ON c.column_default LIKE '%' || s.sequencename || '%'
        WHERE s.schemaname = 'public'
    LOOP
        EXECUTE format('SELECT setval(%L, COALESCE((SELECT MAX(%I) FROM %I.%I), 1), false)', 
                      seq_record.sequencename, 
                      seq_record.columnname, 
                      seq_record.schemaname, 
                      seq_record.tablename);
    END LOOP;
END \$\$;"

echo "✅ Restore completed successfully!"
echo "Database: $TARGET_DB"
echo "Tables: $TABLE_COUNT"
echo "Restore time: $(date)"
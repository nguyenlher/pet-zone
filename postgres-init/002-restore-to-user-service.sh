#!/bin/bash
# Don't use set -e to allow script to continue even if restore fails

# Script to restore User Service database
TARGET_DB="user_db"
DB_FILE="/docker-entrypoint-initdb.d/db/user-service.sql"

echo "=========================================="
echo "Restoring User Service database..."
echo "=========================================="

if [ -f "$DB_FILE" ]; then
    echo "Found database file: $DB_FILE"
    echo "Restoring to database: $TARGET_DB"
    
    # Remove incompatible parameters and restore
    sed 's/SET transaction_timeout = 0;//g' "$DB_FILE" | \
    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$TARGET_DB"
    
    echo "=========================================="
    echo "User Service database restored!"
    echo "=========================================="
else
    echo "=========================================="
    echo "Warning: Database file not found at $DB_FILE"
    echo "User Service will use Liquibase migrations"
    echo "=========================================="
fi

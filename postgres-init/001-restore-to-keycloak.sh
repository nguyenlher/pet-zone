#!/bin/bash
set -e

# Script to restore Keycloak database
TARGET_DB="keycloak_db"
DB_FILE="/docker-entrypoint-initdb.d/db/keycloak_db.sql"

echo "=========================================="
echo "Restoring Keycloak database..."
echo "=========================================="

if [ -f "$DB_FILE" ]; then
    echo "Found database file: $DB_FILE"
    echo "Restoring to database: $TARGET_DB"
    
    # Remove incompatible parameters from SQL file and restore
    sed 's/SET transaction_timeout = 0;//g' "$DB_FILE" | \
    psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$TARGET_DB"
    
    echo "=========================================="
    echo "Keycloak database restored!"
    echo "=========================================="
else
    echo "=========================================="
    echo "Warning: Database file not found at $DB_FILE"
    echo "Keycloak will start with empty database"
    echo "=========================================="
fi

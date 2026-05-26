#!/bin/bash
set -e

echo "=========================================="
echo "Starting database creation..."
echo "=========================================="

# Create databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE keycloak_db;
    CREATE DATABASE user_db;
    CREATE DATABASE pet_db;
    CREATE DATABASE order_db;
    CREATE DATABASE payment_db;
    CREATE DATABASE notification_db;
EOSQL

echo "=========================================="
echo "All databases created successfully!"
echo "=========================================="

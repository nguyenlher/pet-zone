#!/bin/bash
set -e

# Function to create a database if it doesn't exist
create_database() {
    local database=$1
    echo "Creating database: $database"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
        SELECT 'CREATE DATABASE $database'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
EOSQL
}

create_database "keycloak_db"
create_database "user_db"
create_database "pet_db"
create_database "order_db"
create_database "payment_db"
create_database "notification_db"

echo "All databases created successfully."

#!/bin/bash

# Script to create sample users in Keycloak
# Usage: ./create-keycloak-users.sh

set -e

KEYCLOAK_URL="${KEYCLOAK_URL:-http://localhost:8088}"
REALM="${REALM:-super-petmark-3d}"
ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"

echo "=========================================="
echo "Creating Sample Users in Keycloak"
echo "=========================================="
echo "Keycloak URL: $KEYCLOAK_URL"
echo "Realm: $REALM"
echo ""

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
until curl -sf "$KEYCLOAK_URL/realms/$REALM" > /dev/null 2>&1; do
  echo -n "."
  sleep 2
done
echo ""
echo "Keycloak is ready!"
echo ""

# Get admin token
echo "Getting admin access token..."
ADMIN_TOKEN=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$ADMIN_USERNAME" \
  -d "password=$ADMIN_PASSWORD" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Failed to get admin token"
  exit 1
fi

echo "✅ Admin token obtained"
echo ""

# Function to create user
create_user() {
  local username=$1
  local email=$2
  local first_name=$3
  local last_name=$4
  local password=$5

  echo "Creating user: $email..."
  
  # Create user
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$KEYCLOAK_URL/admin/realms/$REALM/users" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"$username\",
      \"email\": \"$email\",
      \"firstName\": \"$first_name\",
      \"lastName\": \"$last_name\",
      \"enabled\": true,
      \"emailVerified\": true,
      \"credentials\": [{
        \"type\": \"password\",
        \"value\": \"$password\",
        \"temporary\": false
      }]
    }")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  
  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "409" ]; then
    echo "✅ User $email created/exists"
  else
    echo "⚠️  Failed to create user $email (HTTP $HTTP_CODE)"
  fi
}

# Create admin user
echo "=========================================="
echo "Creating Admin User"
echo "=========================================="
create_user "admin" "admin@petstore.com" "Admin" "User" "admin123"
echo ""

# Create sample customers
echo "=========================================="
echo "Creating Sample Customers"
echo "=========================================="

create_user "michelle.black" "michelle.black@email.com" "Michelle" "Black" "password123"
create_user "james.wilson" "james.wilson@email.com" "James" "Wilson" "password123"
create_user "sarah.johnson" "sarah.johnson@email.com" "Sarah" "Johnson" "password123"
create_user "robert.davis" "robert.davis@email.com" "Robert" "Davis" "password123"
create_user "emily.clark" "emily.clark@email.com" "Emily" "Clark" "password123"
create_user "daniel.lewis" "daniel.lewis@email.com" "Daniel" "Lewis" "password123"
create_user "jessica.martinez" "jessica.martinez@email.com" "Jessica" "Martinez" "password123"
create_user "kevin.anderson" "kevin.anderson@email.com" "Kevin" "Anderson" "password123"
create_user "amanda.thomas" "amanda.thomas@email.com" "Amanda" "Thomas" "password123"
create_user "brian.jackson" "brian.jackson@email.com" "Brian" "Jackson" "password123"
create_user "rachel.white" "rachel.white@email.com" "Rachel" "White" "password123"
create_user "chris.harris" "chris.harris@email.com" "Chris" "Harris" "password123"
create_user "nicole.taylor" "nicole.taylor@email.com" "Nicole" "Taylor" "password123"
create_user "tyler.moore" "tyler.moore@email.com" "Tyler" "Moore" "password123"
create_user "lauren.garcia" "lauren.garcia@email.com" "Lauren" "Garcia" "password123"
create_user "michael.brown" "michael.brown@email.com" "Michael" "Brown" "password123"
create_user "sophia.miller" "sophia.miller@email.com" "Sophia" "Miller" "password123"
create_user "david.wilson" "david.wilson@email.com" "David" "Wilson" "password123"
create_user "olivia.moore" "olivia.moore@email.com" "Olivia" "Moore" "password123"
create_user "william.taylor" "william.taylor@email.com" "William" "Taylor" "password123"

echo ""
echo "=========================================="
echo "✅ All users created successfully!"
echo "=========================================="
echo ""
echo "Admin Credentials:"
echo "  Email: admin@petstore.com"
echo "  Password: admin123"
echo ""
echo "Sample User Credentials:"
echo "  Email: michelle.black@email.com (or any other)"
echo "  Password: password123"
echo ""

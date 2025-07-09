#!/bin/bash

# KONIVRER Keycloak Setup Script
# This script sets up Keycloak with the KONIVRER realm configuration

set -e

echo "🔐 KONIVRER Keycloak Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
KEYCLOAK_URL="http://localhost:8080"
ADMIN_USER="admin"
ADMIN_PASS="admin"
REALM_NAME="konivrer"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to wait for Keycloak to be ready
wait_for_keycloak() {
    print_status "Waiting for Keycloak to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f "$KEYCLOAK_URL/health/ready" > /dev/null 2>&1; then
            print_success "Keycloak is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts - Keycloak not ready yet, waiting 10 seconds..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Keycloak failed to start within expected time"
    return 1
}

# Function to get admin access token
get_admin_token() {
    print_status "Getting admin access token..."
    
    local response=$(curl -s -X POST "$KEYCLOAK_URL/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$ADMIN_USER" \
        -d "password=$ADMIN_PASS" \
        -d "grant_type=password" \
        -d "client_id=admin-cli")
    
    if [ $? -eq 0 ]; then
        echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4
    else
        print_error "Failed to get admin token"
        return 1
    fi
}

# Function to check if realm exists
realm_exists() {
    local token=$1
    local response=$(curl -s -H "Authorization: Bearer $token" \
        "$KEYCLOAK_URL/admin/realms/$REALM_NAME")
    
    if echo "$response" | grep -q '"realm"'; then
        return 0
    else
        return 1
    fi
}

# Function to create realm
create_realm() {
    local token=$1
    print_status "Creating KONIVRER realm..."
    
    local response=$(curl -s -X POST "$KEYCLOAK_URL/admin/realms" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d @/opt/keycloak/data/import/konivrer-realm.json)
    
    if [ $? -eq 0 ]; then
        print_success "KONIVRER realm created successfully!"
        return 0
    else
        print_error "Failed to create realm: $response"
        return 1
    fi
}

# Function to update realm
update_realm() {
    local token=$1
    print_status "Updating KONIVRER realm..."
    
    local response=$(curl -s -X PUT "$KEYCLOAK_URL/admin/realms/$REALM_NAME" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d @/opt/keycloak/data/import/konivrer-realm.json)
    
    if [ $? -eq 0 ]; then
        print_success "KONIVRER realm updated successfully!"
        return 0
    else
        print_error "Failed to update realm: $response"
        return 1
    fi
}

# Function to create demo users
create_demo_users() {
    local token=$1
    print_status "Creating demo users..."
    
    # Demo user
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "demo",
            "enabled": true,
            "emailVerified": true,
            "firstName": "Demo",
            "lastName": "User",
            "email": "demo@konivrer.com",
            "credentials": [{
                "type": "password",
                "value": "demo123",
                "temporary": false
            }],
            "realmRoles": ["user", "deck-builder"]
        }' > /dev/null
    
    # Admin user
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "konivrer-admin",
            "enabled": true,
            "emailVerified": true,
            "firstName": "KONIVRER",
            "lastName": "Admin",
            "email": "admin@konivrer.com",
            "credentials": [{
                "type": "password",
                "value": "admin123",
                "temporary": false
            }],
            "realmRoles": ["user", "admin", "moderator", "tournament-organizer", "deck-builder", "premium"]
        }' > /dev/null
    
    # Premium user
    curl -s -X POST "$KEYCLOAK_URL/admin/realms/$REALM_NAME/users" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "premium",
            "enabled": true,
            "emailVerified": true,
            "firstName": "Premium",
            "lastName": "User",
            "email": "premium@konivrer.com",
            "credentials": [{
                "type": "password",
                "value": "premium123",
                "temporary": false
            }],
            "realmRoles": ["user", "premium", "deck-builder"]
        }' > /dev/null
    
    print_success "Demo users created!"
}

# Function to display setup information
display_setup_info() {
    echo ""
    echo "🎉 KONIVRER Keycloak Setup Complete!"
    echo "===================================="
    echo ""
    echo "📋 Access Information:"
    echo "  • Keycloak Admin Console: $KEYCLOAK_URL/admin"
    echo "  • Admin Username: $ADMIN_USER"
    echo "  • Admin Password: $ADMIN_PASS"
    echo ""
    echo "🏰 KONIVRER Realm: $REALM_NAME"
    echo "  • Realm URL: $KEYCLOAK_URL/realms/$REALM_NAME"
    echo ""
    echo "👥 Demo Users:"
    echo "  • demo / demo123 (Basic user with deck-builder role)"
    echo "  • konivrer-admin / admin123 (Full admin access)"
    echo "  • premium / premium123 (Premium user)"
    echo ""
    echo "🔧 Client Configuration:"
    echo "  • Client ID: konivrer-app"
    echo "  • Client Secret: konivrer-client-secret-change-in-production"
    echo ""
    echo "⚙️  Environment Variables for KONIVRER App:"
    echo "  REACT_APP_KEYCLOAK_URL=$KEYCLOAK_URL"
    echo "  REACT_APP_KEYCLOAK_REALM=$REALM_NAME"
    echo "  REACT_APP_KEYCLOAK_CLIENT_ID=konivrer-app"
    echo "  REACT_APP_KEYCLOAK_CLIENT_SECRET=konivrer-client-secret-change-in-production"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Update your .env file with the environment variables above"
    echo "  2. Start your KONIVRER application"
    echo "  3. Test the Keycloak login functionality"
    echo "  4. Customize roles and users as needed"
    echo ""
    print_warning "Remember to change the client secret in production!"
}

# Main execution
main() {
    print_status "Starting KONIVRER Keycloak setup..."
    
    # Wait for Keycloak to be ready
    if ! wait_for_keycloak; then
        exit 1
    fi
    
    # Get admin token
    local admin_token=$(get_admin_token)
    if [ -z "$admin_token" ]; then
        print_error "Failed to get admin token"
        exit 1
    fi
    
    print_success "Admin token obtained"
    
    # Check if realm exists and create/update accordingly
    if realm_exists "$admin_token"; then
        print_warning "KONIVRER realm already exists, updating..."
        update_realm "$admin_token"
    else
        create_realm "$admin_token"
    fi
    
    # Create demo users
    create_demo_users "$admin_token"
    
    # Display setup information
    display_setup_info
    
    print_success "Setup completed successfully! 🎉"
}

# Run main function
main "$@"
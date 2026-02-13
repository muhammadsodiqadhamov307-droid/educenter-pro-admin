#!/bin/bash

# Configuration
VERSION="v0.12.1"
DEST_DIR="/usr/local/lib/docker/cli-plugins"
DEST_FILE="$DEST_DIR/docker-buildx"

echo "### 1. Fixing Docker Buildx installation..."

# Detect Architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

if [ "$ARCH" = "x86_64" ]; then
    # Correct filename pattern: buildx-v0.12.1.linux-amd64
    BINARY_NAME="buildx-${VERSION}.linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    BINARY_NAME="buildx-${VERSION}.linux-arm64"
elif [ "$ARCH" = "armv7l" ]; then
    BINARY_NAME="buildx-${VERSION}.linux-arm-v7"
else
    echo "Error: Unsupported architecture: $ARCH"
    exit 1
fi

# Download Binary
URL="https://github.com/docker/buildx/releases/download/$VERSION/$BINARY_NAME"
echo "Downloading $BINARY_NAME from:"
echo "$URL"

sudo mkdir -p "$DEST_DIR"
sudo rm -f "$DEST_FILE"
sudo curl -L "$URL" -o "$DEST_FILE"
sudo chmod +x "$DEST_FILE"

# Verify Download
FILE_SIZE=$(wc -c < "$DEST_FILE")
if [ "$FILE_SIZE" -lt 1000 ]; then
    echo "Error: Download failed (file too small). URL was: $URL"
    exit 1
fi
echo "Docker Buildx installed successfully."
echo

echo "### 2. Configuring Passwords and Environment..."

# Generate a random password if you don't have one
AUTO_PASSWORD="pass_$(date +%s)_$RANDOM"

if [ -f .env ]; then
    echo ".env file exists. Checking configuration..."
    
    # Check if POSTGRES_PASSWORD exists
    if ! grep -q "POSTGRES_PASSWORD" .env; then
        echo "Setting POSTGRES_PASSWORD to auto-generated value..."
        echo >> .env
        echo "POSTGRES_PASSWORD=$AUTO_PASSWORD" >> .env
        
        # Update connection string to use this password
        # Replaces postgres:postgres@ or postgres:mysecretpassword@
        sed -i "s/postgres:postgres@/postgres:$AUTO_PASSWORD@/g" .env
        sed -i "s/postgres:mysecretpassword@/postgres:$AUTO_PASSWORD@/g" .env
        echo "Updated DATABASE_URL in .env"
    else
        echo "Password already configured in .env."
    fi
else
    echo "Creating new .env file with auto-generated password..."
    # Create file
    echo "DATABASE_URL=\"postgresql://postgres:$AUTO_PASSWORD@db:5432/educenter?schema=public\"" > .env
    echo "POSTGRES_PASSWORD=\"$AUTO_PASSWORD\"" >> .env
    echo "API_KEY=\"AIzaSy...\"" >> .env
    echo "PORT=3000" >> .env
    echo "Created .env file."
    echo "WARNING: You still need to open .env and put your real API_KEY!"
fi

echo
echo "### Fix Complete!"
echo "You can now deploy with:"
echo "sudo docker-compose -f docker-compose.prod.yml up -d --build"

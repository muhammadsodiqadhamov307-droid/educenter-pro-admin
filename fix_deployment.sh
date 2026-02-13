#!/bin/bash

# Configuration
VERSION="v0.12.1"
DEST_DIR="/usr/local/lib/docker/cli-plugins"
DEST_FILE="$DEST_DIR/docker-buildx"

echo "### Fixing Docker Buildx installation..."

# 1. Detect Architecture
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

if [ "$ARCH" = "x86_64" ]; then
    BINARY_NAME="buildx-linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    BINARY_NAME="buildx-linux-arm64"
elif [ "$ARCH" = "armv7l" ]; then
    BINARY_NAME="buildx-linux-arm-v7"
else
    echo "Error: Unsupported architecture: $ARCH"
    exit 1
fi

# 2. Download Binary
URL="https://github.com/docker/buildx/releases/download/$VERSION/$BINARY_NAME"
echo "Downloading $BINARY_NAME from:"
echo "$URL"

sudo mkdir -p "$DEST_DIR"
# Remove existing to avoid issues
sudo rm -f "$DEST_FILE"

sudo curl -L "$URL" -o "$DEST_FILE"

# 3. Verify Download
if [ ! -f "$DEST_FILE" ]; then
    echo "Error: File was not downloaded."
    exit 1
fi

FILE_SIZE=$(wc -c < "$DEST_FILE")
echo "Downloaded file size: $FILE_SIZE bytes"

if [ "$FILE_SIZE" -lt 1000 ]; then
    echo "Error: Download failed (file too small). It might be a 404 Not Found."
    echo "Content of file:"
    cat "$DEST_FILE"
    exit 1
fi

sudo chmod +x "$DEST_FILE"
echo "Docker Buildx installed successfully."
echo

# 4. Check Environment Variables
echo "### Checking .env configuration..."
if [ ! -f .env ]; then
    echo "ERROR: .env file is missing!"
    echo "Please create it using 'nano .env'"
    exit 1
fi

if ! grep -q "POSTGRES_PASSWORD" .env; then
    echo "WARNING: POSTGRES_PASSWORD is missing in .env"
    echo "Appending default password configuration..."
    echo -e "\nPOSTGRES_PASSWORD=mysecretpassword" >> .env
    echo "Added POSTGRES_PASSWORD=mysecretpassword to .env"
else
    echo ".env looks good (contains POSTGRES_PASSWORD)."
fi

echo
echo "### Ready to deploy!"
echo "Run: sudo docker-compose -f docker-compose.prod.yml up -d --build"

#!/bin/bash

# 1. Fix Docker Buildx (Architecture Issue)
echo "### Fixing Docker Buildx installation..."
sudo rm -f /usr/local/lib/docker/cli-plugins/docker-buildx

ARCH=$(uname -m)
echo "Detected architecture: $ARCH"

if [ "$ARCH" = "x86_64" ]; then
    BINARY_URL="https://github.com/docker/buildx/releases/latest/download/buildx-linux-amd64"
elif [ "$ARCH" = "aarch64" ]; then
    BINARY_URL="https://github.com/docker/buildx/releases/latest/download/buildx-linux-arm64"
elif [ "$ARCH" = "armv7l" ]; then
    BINARY_URL="https://github.com/docker/buildx/releases/latest/download/buildx-linux-arm-v7"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

echo "Downloading from: $BINARY_URL"
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL "$BINARY_URL" -o /usr/local/lib/docker/cli-plugins/docker-buildx
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

echo "Docker Buildx installed successfully."
echo

# 2. Check Environment Variables
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

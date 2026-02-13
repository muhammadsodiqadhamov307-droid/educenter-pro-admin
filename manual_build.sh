#!/bin/bash

echo "### Bypassing Compose Build..."

# 1. Build the App Image Manually
echo "Building 'educenter-pro-admin-app' image directly..."
sudo docker build -t educenter-pro-admin-app .

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

echo "Image built successfully."

# 2. Run Compose with Production File
# (Now that prod.yml uses the image we just built, it won't try to build again)
echo "Starting services..."
sudo docker-compose -f docker-compose.prod.yml up -d

echo
echo "### Deployment Complete!"
echo "To initialize the database, run:"
echo "sudo docker-compose -f docker-compose.prod.yml exec app npx prisma db push"

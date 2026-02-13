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

# 2. Modify docker-compose to use the local image instead of building
# We'll create a temporary compose file for running
cp docker-compose.prod.yml docker-compose.run.yml

# Replace 'build: .' with 'image: educenter-pro-admin-app'
sed -i 's|build: .|image: educenter-pro-admin-app|g' docker-compose.run.yml

echo "Created docker-compose.run.yml using local image."

# 3. Run Compose
echo "Starting services..."
sudo docker-compose -f docker-compose.run.yml up -d

echo
echo "### Deployment Complete!"
echo "To initialize the database, run:"
echo "sudo docker-compose -f docker-compose.run.yml exec app npx prisma db push"

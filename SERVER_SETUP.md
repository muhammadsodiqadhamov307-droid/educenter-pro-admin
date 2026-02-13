# Server Deployment Guide

Follow these steps to deploy the EduCenter Pro Admin application to your remote server (e.g., AWS EC2, DigitalOcean Droplet, VPS).

## Prerequisites

- Access to a Linux server (Ubuntu recommended).
- `git` installed on the server.
- `docker` and `docker-compose` installed on the server.

## Step 1: Connect to your Server

SSH into your server:
```bash
ssh user@your-server-ip
```

## Step 2: Install Docker and Git

### For Amazon Linux 2023 (AWS EC2)

```bash
# Update packages
sudo dnf update -y

# Install Git and Docker
sudo dnf install -y git docker

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (allows running docker without sudo)
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Docker Buildx (Required for Compose Build)
# Detect architecture (amd64 or arm64/aarch64)
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; elif [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; fi
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL "https://github.com/docker/buildx/releases/latest/download/buildx-linux-$ARCH" -o /usr/local/lib/docker/cli-plugins/docker-buildx
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

# Apply group changes (or log out and log back in)
newgrp docker
```

### For Ubuntu / Debian

```bash
# Update packages
sudo apt-get update

# Install Docker and Git
sudo apt-get install -y docker.io docker-compose git

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
```

## Step 3: Clone the Repository

Clone your project from GitHub:

```bash
git clone https://github.com/muhammadsodiqadhamov307-droid/educenter-pro-admin.git
cd educenter-pro-admin
```

## Step 4: Configure Environment Variables

Create a `.env` file in the project directory. This file will be read by Docker.

```bash
nano .env
```

Paste the following content (adjust the `API_KEY` and `POSTGRES_PASSWORD`):

```env
# Database Internal URL (for Docker container)
# NOTE: Ensure the password matches POSTGRES_PASSWORD below
DATABASE_URL="postgresql://postgres:mysecretpassword@db:5432/educenter?schema=public"

# Database Password (Required for Production)
POSTGRES_PASSWORD="mysecretpassword"

# Your Google Gemini API Key
API_KEY="AIzaSy..."

# Port
PORT=3000
```

Press `Ctrl+O`, `Enter` to save, and `Ctrl+X` to exit.

## Step 5: Build and Run

Start the application using Docker Compose. This command builds the image and starts the containers in the background.

```bash
sudo docker-compose up -d --build
```

## Step 6: Initialize Database

Once the containers are running, you need to push the database schema to the PostgreSQL database running inside Docker.

```bash
sudo docker-compose exec app npx prisma db push
```

## Step 7: Verify Deployment

Your application should now be running!

- Open your browser and visit: `http://your-server-ip:3000`
- API is available at: `http://your-server-ip:3000/api/users`

## Troubleshooting

- **Check Logs:**
  ```bash
  sudo docker-compose logs -f
  ```
- **Restart Application:**
  ```bash
  sudo docker-compose restart
  ```
- **Stop Application:**
  ```bash
  sudo docker-compose down
  ```

## Step 8: Production Setup (Domain & SSL)

**Pre-requisites:**
- You have configured the DNS for `registrationadmin.duckdns.org` to point to your server's IP address.

### 1. Update Configuration
I have already updated the configuration files for your domain (`registrationadmin.duckdns.org`) in the repository. You just need to pull the changes.

On your server:
```bash
git pull
```

### 2. Run SSL Initialization
This script automates the process of getting certificates from Let's Encrypt for `registrationadmin.duckdns.org`.

```bash
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
```

### 3. Start Production Containers
Use the production compose file which enables Nginx and hides the database port.

```bash
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

### 4. Initialize Database (if starting fresh)

```bash
sudo docker-compose -f docker-compose.prod.yml exec app npx prisma db push
```

**Security Note:**
Ensure your server's firewall (AWS Security Group) allows inbound traffic on ports **80 (HTTP)** and **443 (HTTPS)**, and **blocks** port **3000** and **5432** from external access.

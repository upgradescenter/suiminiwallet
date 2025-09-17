#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install dependencies
npm ci --production

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Install and configure Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
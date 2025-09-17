A SUI Mini Wallet App, using Connect Wallet and ZKLogin that generates new wallet per user, the ZKlogin is using Google Consent Window

Demo: https://sui.iamtzar.com/
## Requirements

### System Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Git**: For cloning the repository

### Development Requirements
- **Next.js**: 13.x or higher
- **React**: 18.x or higher
- **TypeScript**: 5.x or higher

### Production Deployment Requirements
- **Ubuntu Server**: 22.04 LTS (recommended)
- **PM2**: Process manager for Node.js applications
- **Nginx**: Web server and reverse proxy
- **SSL Certificate**: For HTTPS (Let's Encrypt or AWS Certificate Manager)

### AWS Services Required
- **EC2**: t3.small or larger instance
- **CloudFront**: CDN distribution
- **Route 53**: DNS management (optional)
- **Certificate Manager**: SSL certificates (optional)

### External Services
- **Google OAuth**: Client ID for ZKLogin authentication
- **SUI Network**: Mainnet or testnet access

### Environment Variables
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

# AWS Deployment Guide

Deploy your SUI Mini Wallet to AWS using EC2 and CloudFront.

## Prerequisites

- AWS Account with EC2 access
- SSH key pair (.pem file)
- Domain name (optional)

## 1. Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Select **Ubuntu Server 22.04 LTS**
3. Choose **t3.small**
4. Use your existing key pair
5. Security Group: Allow ports 22, 80, 443

## 2. Clone Project to EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
git clone https://github.com/upgradescenter/suiminiwallet.git
cd suiminiwallet
```

## 3. Deploy Application

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/suiminiwallet
sudo ln -s /etc/nginx/sites-available/suiminiwallet /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Set Environment Variables

```bash
cp .env.local .env.production.local
nano .env.production.local
```

Update with your production values:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_actual_google_client_id
```

## 5. Create CloudFront Distribution

1. AWS Console → CloudFront → Create Distribution
2. **Origin Domain**: Your EC2 public DNS
3. **Protocol**: HTTP only
4. **Viewer Protocol**: Redirect HTTP to HTTPS
5. **HTTP Methods**: All methods
6. **Cache Policy**: CachingDisabled

## 6. Test Deployment

```bash
# Test EC2
curl http://your-ec2-ip

# Check PM2 status
pm2 status

# View logs
pm2 logs suiminiwallet
```

## 7. Custom Domain (Optional)

1. **Route 53**: Create hosted zone and A record
2. **Certificate Manager**: Request SSL certificate
3. **CloudFront**: Add custom domain and certificate

## Management Commands

```bash
# Restart application
pm2 restart suiminiwallet

# Update application
git pull
npm run build
pm2 restart suiminiwallet

# View logs
pm2 logs suiminiwallet
```

## Security Group Rules

- **SSH (22)**: Your IP only
- **HTTP (80)**: 0.0.0.0/0
- **HTTPS (443)**: 0.0.0.0/0

Your application will be available at your CloudFront distribution URL.

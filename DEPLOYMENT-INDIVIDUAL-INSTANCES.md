# 🚀 Individual Instance Deployment Guide

This guide shows how to deploy Kickstart Portal containers on separate instances with Nginx reverse proxy and AWS RDS.

## 🏗️ Architecture Overview

```
Internet → Nginx Reverse Proxy (Instance 1)
├── Frontend Container (Instance 2)
├── Backend Container (Instance 3)
└── AWS RDS PostgreSQL (Cloud)
```

## 📋 Prerequisites

- 3 EC2 instances (or 2 if running frontend/backend on same instance)
- AWS RDS PostgreSQL instance
- Docker installed on all instances
- Security groups configured

## 🎯 Instance Setup

### Instance 1: Nginx Reverse Proxy
**Purpose**: Load balancer and reverse proxy
**Ports**: 80, 443 (SSL)

### Instance 2: Frontend Container
**Purpose**: React application
**Ports**: 3000 (internal)

### Instance 3: Backend Container
**Purpose**: Node.js API
**Ports**: 5000 (internal)

## 🚀 Step-by-Step Deployment

### 1. AWS RDS Setup

```bash
# Create PostgreSQL RDS instance
# - Engine: PostgreSQL 14
# - Instance: db.t3.micro
# - Public access: Yes
# - Security group: Allow port 5432 from your instances

# Initialize database
psql -h your-rds-endpoint -U kickstart_admin -d kickstart_db -f server/scripts/init-database.sql
```

### 2. Build Containers

```bash
# On your development machine
cd client
docker build -t kickstart-frontend .

cd ../server
docker build -t kickstart-backend .

# Save images for transfer
docker save kickstart-frontend > frontend.tar
docker save kickstart-backend > backend.tar
```

### 3. Deploy Frontend Container (Instance 2)

```bash
# SSH to Instance 2
ssh -i your-key.pem ec2-user@instance2-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Transfer and load image
scp frontend.tar ec2-user@instance2-ip:~/
docker load < frontend.tar

# Create .env file
cat > .env << EOF
REACT_APP_API_URL=http://instance1-ip/api
EOF

# Run frontend container
docker run -d \
    --name kickstart-frontend \
    --restart unless-stopped \
    -p 3000:80 \
    --env-file .env \
    kickstart-frontend
```

### 4. Deploy Backend Container (Instance 3)

```bash
# SSH to Instance 3
ssh -i your-key.pem ec2-user@instance3-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Transfer and load image
scp backend.tar ec2-user@instance3-ip:~/
docker load < backend.tar

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=kickstart_db
DB_USER=kickstart_admin
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://instance1-ip
EOF

# Run backend container
docker run -d \
    --name kickstart-backend \
    --restart unless-stopped \
    -p 5000:5000 \
    --env-file .env \
    kickstart-backend
```

### 5. Deploy Nginx Reverse Proxy (Instance 1)

```bash
# SSH to Instance 1
ssh -i your-key.pem ec2-user@instance1-ip

# Install Docker
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Create nginx configuration
mkdir -p nginx
cat > nginx/nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Upstream servers (replace with your instance IPs)
    upstream backend {
        server instance3-ip:5000;
    }

    upstream frontend {
        server instance2-ip:3000;
    }

    # HTTP server
    server {
        listen 80;
        server_name localhost your-domain.com;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # API routes
        location /api/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Frontend routes
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Run nginx container
docker run -d \
    --name kickstart-nginx \
    --restart unless-stopped \
    -p 80:80 \
    -p 443:443 \
    -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
    nginx:alpine
```

## 🔧 Security Groups Configuration

### Instance 1 (Nginx):
- **Inbound**: 80, 443 from 0.0.0.0/0
- **Outbound**: All traffic

### Instance 2 (Frontend):
- **Inbound**: 3000 from Instance 1 security group
- **Outbound**: All traffic

### Instance 3 (Backend):
- **Inbound**: 5000 from Instance 1 security group
- **Outbound**: All traffic

### RDS Security Group:
- **Inbound**: 5432 from Instance 3 security group

## 📊 Monitoring & Maintenance

### View Logs:
```bash
# Frontend logs
ssh instance2 "docker logs -f kickstart-frontend"

# Backend logs
ssh instance3 "docker logs -f kickstart-backend"

# Nginx logs
ssh instance1 "docker logs -f kickstart-nginx"
```

### Update Containers:
```bash
# Build new images on development machine
# Transfer to instances
# Stop and remove old containers
# Run new containers
```

### Health Checks:
```bash
# Check nginx
curl http://instance1-ip/health

# Check backend
curl http://instance1-ip/api/health

# Check frontend
curl http://instance1-ip/
```

## 🎯 Access Points

- **Main Application**: http://instance1-ip
- **API Endpoint**: http://instance1-ip/api
- **Health Check**: http://instance1-ip/health

## 🔐 Demo Credentials

- **Admin**: admin@kickstart.com / password
- **Employee**: employee@kickstart.com / password
#!/bin/bash

# Individual Docker Container Runner for Kickstart Portal
# Run containers separately on different instances

set -e

echo "🐳 Running Kickstart Portal Containers Individually..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error "❌ .env file not found!"
    echo "Please create .env file with your AWS RDS credentials:"
    echo "cp .env.example .env"
    echo "Then edit .env with your database details"
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$DB_HOST" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    print_error "❌ Missing required environment variables!"
    echo "Please set in .env file:"
    echo "  - DB_HOST (your AWS RDS endpoint)"
    echo "  - DB_PASSWORD (your database password)"
    echo "  - JWT_SECRET (your JWT secret key)"
    exit 1
fi

print_status "✅ Environment variables configured"

# Function to run backend container
run_backend() {
    print_status "🔧 Starting Backend Container..."
    
    # Stop existing container if running
    docker stop kickstart-backend 2>/dev/null || true
    docker rm kickstart-backend 2>/dev/null || true
    
    # Run backend container
    docker run -d \
        --name kickstart-backend \
        --restart unless-stopped \
        -p 5000:5000 \
        -e NODE_ENV=production \
        -e PORT=5000 \
        -e DB_HOST=$DB_HOST \
        -e DB_PORT=${DB_PORT:-5432} \
        -e DB_NAME=${DB_NAME:-kickstart_db} \
        -e DB_USER=${DB_USER:-kickstart_admin} \
        -e DB_PASSWORD=$DB_PASSWORD \
        -e JWT_SECRET=$JWT_SECRET \
        -e CORS_ORIGIN=http://localhost:3000 \
        kickstart-backend
    
    print_status "✅ Backend container started on port 5000"
}

# Function to run frontend container
run_frontend() {
    print_status "🎨 Starting Frontend Container..."
    
    # Stop existing container if running
    docker stop kickstart-frontend 2>/dev/null || true
    docker rm kickstart-frontend 2>/dev/null || true
    
    # Run frontend container
    docker run -d \
        --name kickstart-frontend \
        --restart unless-stopped \
        -p 3000:80 \
        -e REACT_APP_API_URL=http://localhost:5000/api \
        kickstart-frontend
    
    print_status "✅ Frontend container started on port 3000"
}

# Function to run nginx reverse proxy
run_nginx() {
    print_status "🌐 Starting Nginx Reverse Proxy..."
    
    # Stop existing container if running
    docker stop kickstart-nginx 2>/dev/null || true
    docker rm kickstart-nginx 2>/dev/null || true
    
    # Run nginx container
    docker run -d \
        --name kickstart-nginx \
        --restart unless-stopped \
        -p 80:80 \
        -p 443:443 \
        --link kickstart-frontend:frontend \
        --link kickstart-backend:backend \
        -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
        nginx:alpine
    
    print_status "✅ Nginx reverse proxy started on port 80"
}

# Main execution
case "${1:-all}" in
    "backend")
        run_backend
        ;;
    "frontend")
        run_frontend
        ;;
    "nginx")
        run_nginx
        ;;
    "all")
        run_backend
        sleep 5
        run_frontend
        sleep 5
        run_nginx
        ;;
    *)
        echo "Usage: $0 [backend|frontend|nginx|all]"
        echo ""
        echo "Examples:"
        echo "  $0 backend    # Run only backend container"
        echo "  $0 frontend   # Run only frontend container"
        echo "  $0 nginx      # Run only nginx reverse proxy"
        echo "  $0 all        # Run all containers (default)"
        exit 1
        ;;
esac

echo ""
print_status "🎉 Container(s) started successfully!"
echo ""
echo "📊 Container Status:"
docker ps --filter "name=kickstart-"

echo ""
echo "🌐 Access Points:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000"
echo "  Nginx Proxy: http://localhost:80"
echo ""
echo "📋 Useful Commands:"
echo "  View logs: docker logs -f kickstart-[backend|frontend|nginx]"
echo "  Stop all: docker stop kickstart-backend kickstart-frontend kickstart-nginx"
echo "  Remove all: docker rm kickstart-backend kickstart-frontend kickstart-nginx"
echo ""
echo "🎯 Demo Credentials:"
echo "  Admin: admin@kickstart.com / password"
echo "  Employee: employee@kickstart.com / password"
#!/bin/bash

echo "🚀 Starting Kickstart Portal with Docker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials!"
    echo "   Required variables:"
    echo "   - DB_HOST (your AWS RDS endpoint)"
    echo "   - DB_PASSWORD (your database password)"
    echo "   - JWT_SECRET (your JWT secret key)"
    exit 1
fi

# Check if required environment variables are set
source .env

if [ -z "$DB_HOST" ] || [ -z "$DB_PASSWORD" ] || [ -z "$JWT_SECRET" ]; then
    echo "❌ Missing required environment variables!"
    echo "Please set the following in your .env file:"
    echo "  - DB_HOST"
    echo "  - DB_PASSWORD"
    echo "  - JWT_SECRET"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Build and start containers
echo "🐳 Building and starting containers..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check container status
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "🎉 Kickstart Portal is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🌐 Nginx Proxy: http://localhost:80"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"
echo ""
echo "🎯 Demo Credentials:"
echo "  Admin: admin@kickstart.com / password"
echo "  Employee: employee@kickstart.com / password"
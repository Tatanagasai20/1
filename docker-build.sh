#!/bin/bash

echo "🐳 Building Kickstart Portal Docker Containers..."

# Build Backend
echo "🔧 Building Backend Container..."
cd server
docker build -t kickstart-backend .
cd ..

# Build Frontend
echo "🎨 Building Frontend Container..."
cd client
docker build -t kickstart-frontend .
cd ..

echo "✅ All containers built successfully!"
echo ""
echo "To run the application:"
echo "  docker-compose up -d"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop the application:"
echo "  docker-compose down"
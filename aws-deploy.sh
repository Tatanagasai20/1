#!/bin/bash

# AWS Deployment Script for Kickstart Portal
# Builds and pushes separate containers to ECR

set -e

echo "🚀 Starting AWS Deployment for Kickstart Portal..."

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPOSITORY_PREFIX="kickstart"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install it first."
    exit 1
fi

# Login to ECR
print_status "Logging into Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repositories if they don't exist
print_status "Creating ECR repositories..."

# Frontend repository
aws ecr describe-repositories --repository-names $ECR_REPOSITORY_PREFIX-frontend --region $AWS_REGION 2>/dev/null || {
    print_status "Creating frontend repository..."
    aws ecr create-repository --repository-name $ECR_REPOSITORY_PREFIX-frontend --region $AWS_REGION
}

# Backend repository
aws ecr describe-repositories --repository-names $ECR_REPOSITORY_PREFIX-backend --region $AWS_REGION 2>/dev/null || {
    print_status "Creating backend repository..."
    aws ecr create-repository --repository-name $ECR_REPOSITORY_PREFIX-backend --region $AWS_REGION
}

# Build and push Frontend
print_status "Building and pushing Frontend container..."
cd client
docker build -t $ECR_REPOSITORY_PREFIX-frontend .
docker tag $ECR_REPOSITORY_PREFIX-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-frontend:latest
cd ..

# Build and push Backend
print_status "Building and pushing Backend container..."
cd server
docker build -t $ECR_REPOSITORY_PREFIX-backend .
docker tag $ECR_REPOSITORY_PREFIX-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-backend:latest
cd ..

print_status "✅ Containers pushed to ECR successfully!"

# Display ECR repository URLs
echo ""
print_status "ECR Repository URLs:"
echo "Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-frontend"
echo "Backend:  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY_PREFIX-backend"

echo ""
print_status "Next steps:"
echo "1. Deploy ECS services using CloudFormation or AWS CLI"
echo "2. Configure your Load Balancer target groups"
echo "3. Set up your RDS database"
echo ""
echo "Example ECS deployment:"
echo "aws cloudformation deploy --template-file aws-deployment.yml --stack-name kickstart-portal --capabilities CAPABILITY_IAM"
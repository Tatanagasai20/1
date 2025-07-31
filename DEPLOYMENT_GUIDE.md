# Kickstart Portal - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- AWS Account
- Docker (for containerization)
- AWS CLI (for deployment)

## 📋 Step-by-Step Deployment

### 1. AWS Database Setup (RDS PostgreSQL)

#### Create RDS Instance:
1. **Go to AWS RDS Console**
2. **Click "Create database"**
3. **Choose "PostgreSQL"**
4. **Select "Free tier" (development) or "Production"**
5. **Configure:**
   - DB instance identifier: `kickstart-portal-db`
   - Master username: `kickstart_admin`
   - Master password: (create strong password)
   - DB name: `kickstart_db`

#### Network Settings:
- **VPC**: Default VPC
- **Public access**: Yes (for development)
- **VPC security group**: Create new with port 5432 open
- **Availability Zone**: Choose closest to you

#### Database Settings:
- **Instance class**: `db.t3.micro` (free) or `db.t3.small` (production)
- **Storage**: 20 GB (auto-scaling enabled)
- **Backup retention**: 7 days

### 2. Database Initialization

#### Connect to Database:
```bash
# Using psql (install PostgreSQL client)
psql -h your-rds-endpoint.region.rds.amazonaws.com -U kickstart_admin -d kickstart_db

# Or use pgAdmin/any PostgreSQL client
```

#### Run Schema Script:
```sql
-- Copy and paste the contents of server/scripts/init-database.sql
-- This will create all tables and insert sample data
```

### 3. Backend Setup

#### Install Dependencies:
```bash
cd server
npm install
```

#### Environment Configuration:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your RDS details
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=kickstart_db
DB_USER=kickstart_admin
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-jwt-key-here
```

#### Start Backend:
```bash
npm run dev
# Backend will run on http://localhost:5000
```

### 4. Frontend Setup

#### Install Dependencies:
```bash
cd client
npm install
```

#### Start Frontend:
```bash
npm start
# Frontend will run on http://localhost:3000
```

## 🔧 Development Commands

### Backend:
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Frontend:
```bash
cd client
npm start           # Start development server
npm run build       # Build for production
```

## 🐳 Docker Deployment (Optional)

### Build Docker Image:
```bash
# From project root
docker build -t kickstart-portal .
```

### Run with Docker:
```bash
docker run -p 5000:5000 \
  -e DB_HOST=your-rds-endpoint \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  kickstart-portal
```

## 🌐 Production Deployment

### Option 1: AWS ECS (Recommended)
1. **Create ECR Repository**
2. **Build and push Docker image**
3. **Create ECS Cluster and Service**
4. **Configure Application Load Balancer**

### Option 2: AWS EC2
1. **Launch EC2 instance**
2. **Install Node.js and PM2**
3. **Deploy application**
4. **Configure Nginx reverse proxy**

### Option 3: AWS Lambda + API Gateway
1. **Convert to serverless functions**
2. **Deploy using Serverless Framework**
3. **Configure API Gateway**

## 🔐 Security Checklist

- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Set up proper CORS configuration
- [ ] Use environment variables for secrets
- [ ] Enable AWS CloudTrail for monitoring
- [ ] Set up database backups
- [ ] Configure security groups properly

## 📊 Monitoring & Logging

### AWS CloudWatch:
- Set up log groups for application logs
- Create dashboards for monitoring
- Set up alarms for errors

### Database Monitoring:
- Enable RDS Performance Insights
- Set up CloudWatch alarms for database metrics

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example:
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push to ECR
        # Add your deployment steps
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check security group allows port 5432
   - Verify database endpoint and credentials
   - Ensure SSL is configured properly

2. **CORS Errors**
   - Update CORS_ORIGIN in .env
   - Check frontend API calls

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review AWS RDS documentation
3. Check application logs in CloudWatch

## 🎯 Demo Credentials

After setup, you can login with:
- **Admin**: admin@kickstart.com / password
- **Employee**: employee@kickstart.com / password
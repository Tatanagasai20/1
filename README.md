# 🚀 Kickstart Portal

A modern HR/Employee portal application similar to Keka, built with React, Node.js, and PostgreSQL.

![Kickstart Portal](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![AWS](https://img.shields.io/badge/AWS-RDS-orange)

## ✨ Features

- **👥 Employee Management** - Complete employee profiles and information
- **⏰ Attendance Tracking** - Clock in/out with time tracking
- **📅 Leave Management** - Request and approve leave applications
- **💰 Payroll System** - Salary and payment management
- **📄 Document Management** - Upload and organize company documents
- **🔔 Notifications** - Real-time notifications and alerts
- **📊 Analytics Dashboard** - Beautiful charts and statistics
- **🔐 Secure Authentication** - JWT-based authentication system
- **📱 Responsive Design** - Works on all devices

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Node.js) ←→ Database (PostgreSQL on AWS RDS)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS Account (for database)
- PostgreSQL client (optional)

### 1. Clone Repository
```bash
git clone <repository-url>
cd kickstart-portal
```

### 2. Setup Database (AWS RDS)
1. Create PostgreSQL RDS instance in AWS
2. Run the initialization script: `server/scripts/init-database.sql`
3. Note your database endpoint and credentials

### 3. Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Start Application
```bash
# Option 1: Use the start script
./start.sh

# Option 2: Manual start
cd server && npm install && npm run dev
cd client && npm install && npm start
```

## 📋 Database Setup

### AWS RDS PostgreSQL Configuration:

1. **Create RDS Instance:**
   - Engine: PostgreSQL 14
   - Instance: db.t3.micro (free tier)
   - Storage: 20 GB
   - Public access: Yes (for development)

2. **Security Group:**
   - Allow port 5432 from your IP

3. **Database Details:**
   - Database name: `kickstart_db`
   - Username: `kickstart_admin`
   - Password: (create strong password)

4. **Initialize Database:**
   ```sql
   -- Connect to your RDS instance and run:
   -- Copy contents of server/scripts/init-database.sql
   ```

## 🔧 Environment Variables

Create `server/.env`:
```env
# Database Configuration
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=kickstart_db
DB_USER=kickstart_admin
DB_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 🎯 Demo Credentials

After setup, login with:
- **Admin**: `admin@kickstart.com` / `password`
- **Employee**: `employee@kickstart.com` / `password`

## 📁 Project Structure

```
kickstart-portal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── contexts/     # React contexts
│   └── public/
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── config/           # Database config
│   └── scripts/          # Database scripts
├── Dockerfile            # Docker configuration
├── start.sh             # Quick start script
└── DEPLOYMENT_GUIDE.md  # Detailed deployment guide
```

## 🛠️ Development

### Backend Commands:
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Frontend Commands:
```bash
cd client
npm start           # Start development server
npm run build       # Build for production
```

## 🐳 Docker Deployment

### Build Image:
```bash
docker build -t kickstart-portal .
```

### Run Container:
```bash
docker run -p 5000:5000 \
  -e DB_HOST=your-rds-endpoint \
  -e DB_PASSWORD=your-password \
  -e JWT_SECRET=your-secret \
  kickstart-portal
```

## 🌐 Production Deployment

### Recommended: AWS ECS
1. Create ECR repository
2. Build and push Docker image
3. Create ECS cluster and service
4. Configure Application Load Balancer

### Alternative: AWS EC2
1. Launch EC2 instance
2. Install Node.js and PM2
3. Deploy application
4. Configure Nginx reverse proxy

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- SQL injection prevention
- SSL/TLS encryption

## 📊 Monitoring

### AWS CloudWatch:
- Application logs
- Database metrics
- Performance monitoring
- Error tracking

### Database Monitoring:
- RDS Performance Insights
- Query optimization
- Connection pooling

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check security group allows port 5432
   - Verify database endpoint and credentials
   - Ensure SSL is configured properly

2. **CORS Errors**
   - Update CORS_ORIGIN in .env
   - Check frontend API calls

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review AWS RDS documentation
3. Check application logs in CloudWatch

## 🎉 Features Overview

### Dashboard
- Employee statistics
- Attendance overview
- Recent activities
- Performance charts

### Employee Management
- Employee profiles
- Department organization
- Salary information
- Contact details

### Attendance System
- Clock in/out functionality
- Time tracking
- Attendance reports
- Working hours calculation

### Leave Management
- Leave request submission
- Approval workflow
- Leave balance tracking
- Calendar integration

### Payroll System
- Salary management
- Allowances and deductions
- Payment tracking
- Financial reports

### Document Management
- File upload system
- Document categorization
- Access control
- Version management

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
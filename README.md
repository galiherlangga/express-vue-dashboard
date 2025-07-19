# ExpressVueDashboard

A full-stack web application built with Vue.js frontend and Express.js backend, featuring user authentication, role-based access control, and a modern admin dashboard interface.

## 🚀 Features

- **Modern Frontend**: Vue.js 2.6 with Bootstrap Vue for responsive UI
- **Robust Backend**: Express.js API with JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based user authentication and authorization
- **Role-based Access**: Admin and user role management
- **Testing**: Comprehensive test suites for both frontend and backend
- **Docker Support**: Full containerization with Docker Compose
- **Reverse Proxy**: Nginx configuration for production deployment
- **Security**: Helmet.js, CORS, and rate limiting

## 📁 Project Structure

```
ExpressVueDashboard/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/            # Database and app configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Custom middleware (auth, validation)
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── seeders/          # Database seeders
│   │   └── app.js            # Main application file
│   ├── tests/                # Backend test suites
│   ├── Dockerfile            # Backend container configuration
│   └── package.json          # Backend dependencies
├── frontend/                  # Vue.js client application
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable Vue components
│   │   ├── layouts/          # Page layouts
│   │   ├── router/           # Vue Router configuration
│   │   ├── views/            # Page components
│   │   ├── App.vue           # Root component
│   │   └── main.js           # Application entry point
│   ├── tests/                # Frontend test suites
│   ├── Dockerfile            # Frontend container configuration
│   └── package.json          # Frontend dependencies
├── mongo-init/               # MongoDB initialization scripts
├── nginx/                    # Nginx reverse proxy configuration
├── docker-compose.yml        # Multi-container orchestration
└── README.md                 # This file
```

## 🛠️ Technologies Used

### Frontend
- **Vue.js 2.6** - Progressive JavaScript framework
- **Vue Router 3** - Client-side routing
- **Bootstrap Vue** - UI component library
- **Axios** - HTTP client for API requests
- **Jest** - Testing framework

### Backend
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet.js** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Jest & Supertest** - Testing frameworks

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and load balancer
- **Node.js 18+** - Runtime environment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- MongoDB (local installation or cloud service)
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpressVueDashboard
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Database
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=yourpassword
   MONGO_INITDB_DATABASE=expressvue
   MONGODB_URI=mongodb://admin:yourpassword@mongodb:27017/expressvue?authSource=admin
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Environment
   NODE_ENV=production
   PORT=8080
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - **🌐 Main Application (Recommended)**: http://localhost:8888 (via Nginx reverse proxy)
   - **Frontend Direct**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **MongoDB**: localhost:27017

   > **Note**: Use port 8888 for the complete application experience with proper routing and load balancing.

### Option 2: Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ExpressVueDashboard
   ```

2. **Setup MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `expressvue`

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb://localhost:27017/expressvue" > .env
   echo "JWT_SECRET=your-super-secret-jwt-key" >> .env
   echo "NODE_ENV=development" >> .env
   echo "PORT=8080" >> .env
   
   # Seed database with sample users
   npm run seed:users
   
   # Start development server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run serve
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080
   
   > **Note**: For Docker deployment, use http://localhost:8888 for the complete application via Nginx.

## 📝 Default Users

After running the database seeder, you can login with:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm run test:unit
```

### Run Tests in Docker
```bash
# Backend tests
docker-compose exec backend npm test

# Frontend tests
docker-compose exec frontend npm run test:unit
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /health` - Application health status

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development|production
PORT=8080
MONGODB_URI=mongodb://localhost:27017/expressvue
JWT_SECRET=your-secret-key
```

**Frontend (vue.config.js)**
```javascript
module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```

### Port Configuration

| Service | Development | Docker | Description |
|---------|-------------|--------|-------------|
| **Main App (Nginx)** | **N/A** | **8888** | **🌐 Complete application (Recommended)** |
| Frontend | 3000 | 3000 | Vue.js development server |
| Backend | 8080 | 3001 | Express.js API server |
| MongoDB | 27017 | 27017 | Database server |

> **Primary Access Point**: Use **http://localhost:8888** when running with Docker for the best experience.

## 🚀 Production Deployment

### Docker Production
```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Manual Production Build
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
# Serve these files with a web server like Nginx
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- Role-based access control

## 📊 Monitoring & Health Checks

Health check endpoints are available for monitoring:
- **Main Application**: `http://localhost:8888/health` (via Nginx)
- Frontend: `http://localhost:3000/health`
- Backend: `http://localhost:8080/health`

Docker containers include health checks for:
- Application availability
- Database connectivity
- Service dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**MongoDB Connection Error**
```bash
# Check if MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb
```

**Frontend Build Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Issues

**Rebuild containers**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**View service logs**
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
```

For more help, please open an issue in the repository.
# MasukiBooks - Complete Setup Guide

## 🎯 Overview

MasukiBooks is a full-stack e-commerce platform for selling books online, with a React frontend and Spring Boot backend.

## 📋 Prerequisites

### Required Software
- **Java JDK 21** (LTS) - Already configured ✓
- **Maven 3.9+** - Already installed ✓
- **Node.js 18+** and npm
- **PostgreSQL 14+** (or Supabase account)
- **Git** (for version control)

### Verify Installations
```bash
java -version    # Should show Java 21
mvn -version     # Should show Maven 3.9+
node -version    # Should show v18+
npm -version     # Should show 9+
```

## 🚀 Quick Start

### 1. Database Setup

#### Option A: Using Supabase (Recommended for Development)
The backend is already configured for Supabase. The database schema will be created automatically by JPA/Hibernate.

1. Go to [supabase.com](https://supabase.com) and sign in
2. The project is already connected to: `bbrxdsaojiqdgrdyghih.supabase.co`
3. Database will auto-initialize on first backend startup

#### Option B: Local PostgreSQL
If you prefer local PostgreSQL:

```bash
# Create database
createdb masukibooks

# Update backend configuration
# Edit: masuki-backend/masukibooks-backend/src/main/resources/application-dev.yml
# Change datasource.url to: jdbc:postgresql://localhost:5432/masukibooks
# Change username and password to your local PostgreSQL credentials
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd masuki-backend/masukibooks-backend

# The backend is already configured for Java 21 with Spring Boot 3.3.5
# Start the backend (this will auto-create database tables)
mvn spring-boot:run

# Backend will start on http://localhost:8081
# API endpoints available at http://localhost:8081/api/v1/
# Swagger UI: http://localhost:8081/swagger-ui.html (if enabled)
```

**Backend should show**: 
```
Started MasukibooksApplication in X.XXX seconds
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd masukibooks-frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will start on http://localhost:5173 (Vite default)
```

**Frontend should show**:
```
VITE v8.x.x ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Access the Application

1. Open browser: **http://localhost:5173**
2. You should see the MasukiBooks homepage
3. Click "Login" to test authentication

## 🔐 Demo Accounts

### For Testing (Demo Mode - Works Offline)
- **Regular User**: 
  - Email: `user@masukibooks.com`
  - Password: `password123`
- **Admin User**:
  - Email: `admin@masukibooks.com`
  - Password: `admin123`

### For Backend Testing (Requires Registration)
Use the signup page to create a real account that will be stored in the database.

## 🔧 Configuration Files

### Frontend Environment Variables
**File**: `masukibooks-frontend/.env`
```env
VITE_API_URL=http://localhost:8081/api/v1
VITE_SUPABASE_URL=https://bbrxdsaojiqdgrdyghih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend Configuration
**Active Profile**: `dev` (defined in application.yml)

**File**: `masuki-backend/masukibooks-backend/src/main/resources/application-dev.yml`
- Database: Supabase PostgreSQL (already configured)
- Port: 8081
- CORS: Enabled for `http://localhost:5173`
- JPA: `ddl-auto: update` (auto-creates tables)

## 🔍 Troubleshooting

### Issue: Frontend shows "Unable to connect to server"

**Cause**: Backend is not running or running on wrong port

**Solution**:
1. Check if backend is running: `curl http://localhost:8081/actuator/health`
2. Should return: `{"status":"UP"}`
3. If not, start backend: `cd masuki-backend/masukibooks-backend && mvn spring-boot:run`

### Issue: "Port 8081 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8081 | xargs kill -9
```

### Issue: "Port 5173 already in use"

**Solution**:
```bash
# The frontend will automatically select next available port (5174, 5175, etc.)
# Or stop the process using port 5173
```

### Issue: Database connection fails

**Check**:
1. Supabase project is active
2. Database credentials in `application-dev.yml` are correct
3. Network allows connection to Supabase
4. Run backend with `-X` flag for debug: `mvn spring-boot:run -X`

### Issue: CORS errors in browser console

**Solution**: Already configured! CORS allows all origins with credentials in `SecurityConfig.java`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/admin/login` - Admin login

### Products
- `GET /api/v1/products` - List all products (public)
- `GET /api/v1/products/{id}` - Get product details (public)
- `GET /api/v1/categories` - List categories (public)

### Cart (Requires Authentication)
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/{id}` - Update cart item
- `DELETE /api/v1/cart/items/{id}` - Remove from cart

### User Profile (Requires Authentication)
- `GET /api/v1/users/me` - Get current user profile
- `PATCH /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/change-password` - Change password

### Admin (Requires Admin Role)
- `GET /api/v1/admin/users` - List all users
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/{id}` - Update product
- `DELETE /api/v1/admin/products/{id}` - Delete product

## 🎨 Frontend Structure

```
masukibooks-frontend/
├── src/
│   ├── app/              # Redux store
│   ├── assets/           # Images, fonts
│   ├── components/       # Reusable components
│   │   ├── auth/         # ProtectedRoute
│   │   ├── layout/       # Navbar, Footer
│   │   └── ui/           # UI components
│   ├── features/         # Feature modules
│   │   ├── auth/         # Login, Signup
│   │   ├── catalog/      # Book listing
│   │   ├── cart/         # Shopping cart
│   │   └── user/         # User dashboard
│   ├── routes/           # Route configuration
│   ├── services/         # API services
│   └── types/            # TypeScript types
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## 🏗️ Backend Structure

```
masukibooks-backend/
├── src/main/java/com/masukibooks/
│   ├── config/           # Security, CORS config
│   ├── controller/       # REST controllers
│   ├── dto/              # Request/Response DTOs
│   ├── entity/           # JPA entities
│   ├── exception/        # Exception handling
│   ├── repository/       # Data repositories
│   ├── security/         # JWT authentication
│   └── service/          # Business logic
├── src/main/resources/
│   ├── application.yml           # Main config
│   ├── application-dev.yml       # Dev config
│   └── application-prod.yml      # Production config
└── pom.xml                       # Maven dependencies
```

## 🚢 Deployment

### Backend Deployment (AWS EC2)

1. Package the application:
```bash
cd masuki-backend/masukibooks-backend
mvn clean package -DskipTests
```

2. JAR file location: `target/masukibooks-backend-1.0.0.jar`

3. Run on server:
```bash
# Upload JAR to EC2 instance
scp target/masukibooks-backend-1.0.0.jar ubuntu@your-ec2-ip:~/

# SSH to EC2
ssh ubuntu@your-ec2-ip

# Run with production profile
java -jar masukibooks-backend-1.0.0.jar --spring.profiles.active=prod
```

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd masukibooks-frontend
npm run build
```

2. Built files location: `dist/`

3. Deploy to Vercel:
```bash
npm install -g vercel
vercel deploy --prod
```

4. **Important**: Set environment variable on Vercel:
   - `VITE_API_URL` = Your backend URL (e.g., `https://api.masukibooks.com/api/v1`)

## 📊 Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite 8** (build tool)
- **Redux Toolkit** (state management)
- **React Router 7** (routing)
- **Framer Motion 12** (animations)
- **Axios 1.13** (HTTP client)

### Backend
- **Java 21** (LTS)
- **Spring Boot 3.3.5**
- **Spring Security 6.3** (JWT authentication)
- **Spring Data JPA** (Hibernate 6)
- **PostgreSQL 42.7** (database driver)
- **Maven 3.9.9** (build tool)

### Database
- **PostgreSQL 14+** (via Supabase)
- **JPA/Hibernate** (ORM)
- **HikariCP** (connection pooling)

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
mvn spring-boot:run              # Run application
mvn clean install                # Build and install
mvn clean package                # Package JAR
mvn test                         # Run tests
mvn spring-boot:run -X           # Run with debug logging
```

## ✅ System Requirements

### Development
- **RAM**: 8GB minimum (16GB recommended)
- **Disk**: 2GB free space
- **OS**: Windows 10+, macOS 11+, or Linux
- **Browser**: Chrome, Firefox, Safari, or Edge (latest)

### Production
- **Backend**: 2GB RAM, 1 CPU core minimum
- **Database**: PostgreSQL-compatible (Supabase handled)
- **Frontend**: CDN/Static hosting (Vercel, Netlify)

## 📞 Support & Resources

- **Backend Issues**: Check `masuki-backend/masukibooks-backend/README.md`
- **Database Setup**: Check `masuki-backend/masukibooks-backend/SUPABASE_SETUP.md`
- **Frontend Issues**: Check browser console for errors

## 🔄 Next Steps After Setup

1. **Test Authentication**: Try registering and logging in
2. **Browse Catalog**: View the product listings
3. **Test Cart**: Add items to cart (requires login)
4. **Check Admin Panel**: Login as admin to see admin features (requires backend data)

---

## 🎉 You're All Set!

If both frontend and backend are running without errors, you should now have:
- ✅ Frontend running on http://localhost:5173
- ✅ Backend running on http://localhost:8081
- ✅ Database connected and tables auto-created
- ✅ CORS configured properly
- ✅ Authentication working (demo mode + backend)

**Start by visiting**: http://localhost:5173

**Happy Coding! 📚**

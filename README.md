# 📚 MasukiBooks - Online Bookstore Platform

A modern, full-stack e-commerce platform for selling books online.

## 🚀 Quick Start

### Prerequisites
- Java 21 (LTS)
- Maven 3.9+
- Node.js 18+
- PostgreSQL 14+ (or Supabase account)

### One-Command Startup

**Windows**:
```bash
start.bat
```

**Linux/Mac**:
```bash
chmod +x start.sh stop.sh
./start.sh
```

That's it! The application will start automatically and open in your browser.

### Manual Startup

**Backend (Terminal 1)**:
```bash
cd masuki-backend/masukibooks-backend
mvn spring-boot:run
```

**Frontend (Terminal 2)**:
```bash
cd masukibooks-frontend
npm install  # First time only
npm run dev
```

**Access**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8081/api/v1
- Health Check: http://localhost:8081/actuator/health

## 📖 Documentation

- **[Complete Setup Guide](PROJECT_SETUP.md)** - Detailed setup instructions
- **[Fix Summary](FIX_SUMMARY.md)** - What was fixed and why
- **[Backend README](masuki-backend/masukibooks-backend/README.md)** - Backend documentation
- **[Database Setup](masuki-backend/masukibooks-backend/SUPABASE_SETUP.md)** - Database configuration

## 🧪 Demo Accounts

Try these demo accounts (work offline):

**Regular User**:
- Email: `user@masukibooks.com`
- Password: `password123`

**Admin User**:
- Email: `admin@masukibooks.com`
- Password: `admin123`

## 🏗️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite 8 (Build Tool)
- Redux Toolkit (State Management)
- React Router 7 (Routing)
- Framer Motion 12 (Animations)
- Axios 1.13 (HTTP Client)

### Backend
- Java 21 (LTS)
- Spring Boot 3.3.5
- Spring Security 6.3 (JWT)
- Spring Data JPA (Hibernate 6)
- PostgreSQL (via Supabase)
- Maven 3.9.9

## 📁 Project Structure

```
MasukiBooks/
├── masuki-backend/             # Spring Boot backend
│   └── masukibooks-backend/
│       ├── src/                # Java source code
│       ├── init_db.sql         # Database initialization
│       └── pom.xml             # Maven configuration
├── masukibooks-frontend/       # React frontend
│   ├── src/                    # React source code
│   ├── .env                    # Environment variables
│   └── package.json            # npm dependencies
├── start.bat                   # Windows quick start
├── start.sh                    # Linux/Mac quick start
├── stop.sh                     # Linux/Mac stop script
├── PROJECT_SETUP.md            # Detailed setup guide
├── FIX_SUMMARY.md              # Fix documentation
└── README.md                   # This file
```

## 🔧 Configuration

### Frontend Environment (.env)
```env
VITE_API_URL=http://localhost:8081/api/v1
VITE_SUPABASE_URL=https://bbrxdsaojiqdgrdyghih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cC...
```

### Backend Configuration
- **Port**: 8081
- **Profile**: dev (auto-creates database tables)
- **Database**: Supabase PostgreSQL (configured)
- **CORS**: Enabled for all origins (development)

## 🐛 Troubleshooting

### Backend won't start?
```bash
# Check Java version
java -version  # Should be 21

# Check if port 8081 is in use
# Windows: netstat -ano | findstr :8081
# Linux/Mac: lsof -ti:8081
```

### Frontend won't start?
```bash
# Clear cache and reinstall
cd masukibooks-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't connect to API?
1. Verify backend is running: `curl http://localhost:8081/actuator/health`
2. Check frontend .env has correct `VITE_API_URL`
3. Look for CORS errors in browser console

## 📊 Features

### Implemented ✅
- User authentication (JWT)
- Product catalog with search
- Shopping cart
- User profiles
- Protected routes (role-based)
- Admin dashboard
- Demo mode (works offline)
- Responsive UI with animations

### Planned 🚧
- Order processing
- Payment integration (Razorpay/Stripe)
- Email notifications
- Product reviews
- Wishlist functionality
- Order tracking
- AWS S3 image upload

## 🔐 Security

- JWT token authentication
- BCrypt password hashing
- CORS configuration
- Environment variables for secrets
- SQL injection protection (JPA)
- XSS protection (React)

## 🚀 Deployment

### Backend (AWS EC2)
```bash
mvn clean package -DskipTests
# Upload target/masukibooks-backend-1.0.0.jar to server
java -jar masukibooks-backend-1.0.0.jar --spring.profiles.active=prod
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
# Set VITE_API_URL environment variable
```

## 📝 Development

### Adding New Features

1. **Backend**: Add controller, service, repository
2. **Frontend**: Add service, Redux slice, components
3. **Update**: Both this README and PROJECT_SETUP.md

### Code Structure

**Backend**: Controller → Service → Repository → Entity
**Frontend**: Component → Service → Redux → API

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit pull request

## 📄 License

This project is for educational and portfolio purposes.

## 👨‍💻 Author

MasukiBooks Development Team

---

## 📚 Learn More

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Vite Documentation](https://vitejs.dev)

---

**Need Help?** Check [PROJECT_SETUP.md](PROJECT_SETUP.md) for detailed instructions.

**Found a Bug?** Read [FIX_SUMMARY.md](FIX_SUMMARY.md) for troubleshooting.

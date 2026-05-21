# InsureIQ Authentication Setup Guide

Complete authentication system has been implemented with FastAPI backend and React frontend integration.

## Architecture

### Backend (FastAPI)
- **Port**: 5000
- **Database**: PostgreSQL
- **Cache**: Redis
- **Authentication**: JWT with refresh token rotation

### Frontend (React)
- **Port**: 5173
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.11 (if running backend locally)

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

This will install:
- axios (for API calls)
- All existing React dependencies

### 2. Start Docker Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- FastAPI backend on port 5000

### 3. Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at http://localhost:5173

### 4. Verify Backend

- Swagger UI: http://localhost:5000/docs
- Health check: http://localhost:5000/health

## Authentication Flow

### Registration
1. User fills registration form (name, email, password)
2. Frontend calls POST /api/auth/register
3. Backend creates user with hashed password
4. Frontend automatically logs in the user

### Login
1. User fills login form (email, password)
2. Frontend calls POST /api/auth/login
3. Backend validates credentials and returns access + refresh tokens
4. Tokens stored in localStorage
5. User redirected to dashboard

### Protected Routes
- All routes except / and /register require authentication
- ProtectedRoute component checks auth status
- If not authenticated, redirects to login

### Token Refresh
- Axios interceptor automatically refreshes tokens on 401 errors
- Refresh token rotation implemented for security
- If refresh fails, user logged out and redirected to login

### Logout
1. User clicks Sign Out
2. Frontend calls POST /api/auth/logout
3. Backend invalidates refresh token in Redis
4. Frontend clears localStorage
5. User redirected to login

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/logout` - Logout and invalidate tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

## Environment Variables

Backend uses these environment variables (see .env.example):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/insuriq
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
```

## Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Tokens**: Access tokens (30 min) + Refresh tokens (7 days)
- **Token Rotation**: Refresh tokens rotated on each use
- **Redis Session Storage**: Refresh tokens stored in Redis for revocation
- **CORS**: Configured for localhost:5173 only
- **Protected Routes**: Backend middleware validates JWT on protected endpoints

## Troubleshooting

### Backend won't start
- Check Docker containers: `docker-compose ps`
- Check logs: `docker-compose logs backend`
- Ensure PostgreSQL and Redis are healthy

### Frontend connection errors
- Verify backend is running on port 5000
- Check CORS configuration in backend/main.py
- Ensure no firewall blocking localhost:5000

### Login fails
- Check backend logs for errors
- Verify PostgreSQL database is accessible
- Check Redis is running
- Try registering a new user

### Token refresh issues
- Check Redis is running and accessible
- Verify refresh token expiration settings
- Check browser localStorage for tokens

## Development

### Running Backend Locally (without Docker)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
```

### Running Database Locally (without Docker)

```bash
# Start PostgreSQL
docker run -d --name insuriq-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=insuriq \
  -p 5432:5432 \
  postgres:15-alpine

# Start Redis
docker run -d --name insuriq-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Stopping Services

```bash
# Stop Docker services
docker-compose down

# Stop frontend (Ctrl+C in terminal)
```

## File Structure

### Backend
```
backend/
├── main.py              # FastAPI application
├── requirements.txt      # Python dependencies
├── Dockerfile          # Docker image
├── core/
│   ├── config.py       # Settings and environment variables
│   ├── database.py     # PostgreSQL connection
│   ├── security.py     # JWT and password hashing
│   └── redis_client.py # Redis connection
├── models/
│   └── user.py         # User SQLAlchemy model
├── schemas/
│   └── user.py         # Pydantic schemas
├── services/
│   └── auth_service.py # Authentication business logic
├── middleware/
│   └── auth.py         # JWT authentication middleware
└── routers/
    └── auth.py         # Authentication endpoints
```

### Frontend
```
src/
├── contexts/
│   └── AuthContext.tsx  # Authentication context provider
├── services/
│   └── api.ts          # Axios instance with interceptors
├── pages/Auth/
│   ├── Login.tsx       # Login page (updated)
│   └── Register.tsx    # Register page (updated)
└── components/layout/
    ├── ProtectedRoute.tsx  # Route protection (updated)
    └── AppShell.tsx       # Layout with logout (updated)
```

## Testing

### Test Registration
1. Go to http://localhost:5173/register
2. Fill form with name, email, password
3. Submit - should redirect to /intake

### Test Login
1. Go to http://localhost:5173
2. Enter credentials
3. Submit - should redirect to /dashboard

### Test Protected Routes
1. Logout
2. Try accessing http://localhost:5173/dashboard
3. Should redirect to login

### Test Token Refresh
1. Login
2. Wait 30 minutes (access token expires)
3. Navigate to protected route
4. Should automatically refresh token

## Production Deployment

Before deploying to production:

1. **Change SECRET_KEY** in environment variables
2. **Update CORS** to allow production domain
3. **Use HTTPS** for all endpoints
4. **Set secure cookies** if using cookie-based auth
5. **Configure rate limiting** on API endpoints
6. **Set up database backups**
7. **Configure Redis persistence**
8. **Use environment-specific configs**

## Support

For issues or questions:
- Check Docker logs: `docker-compose logs -f`
- Check browser console for frontend errors
- Check backend logs for API errors
- Verify all services are running: `docker-compose ps`

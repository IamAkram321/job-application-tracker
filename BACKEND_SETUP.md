# Backend Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

### MongoDB Installation Options

#### Option 1: Local MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- Default connection: `mongodb://localhost:27017/jobtrackr`

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at: https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env` file

## Quick Start

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/jobtrackr

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Seed the Database (Optional)

Populate database with sample data:

```bash
npm run seed
```

This creates:
- Test user: `test@example.com` / `password123`
- 12 sample job applications

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will start on: http://localhost:5000

## Testing the API

### Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "JobTrackr API is running",
  "timestamp": "2024-11-01T..."
}
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the returned token for authenticated requests.

### Get Applications

```bash
curl http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Application

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "company": "Google",
    "role": "Frontend Developer",
    "status": "Applied",
    "location": "San Francisco, CA",
    "salary": 120000,
    "notes": "Applied through LinkedIn",
    "tags": "Remote, Full-time"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats/summary` - Get statistics

### Health
- `GET /api/health` - Server health check

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoNetworkError: failed to connect`

**Solutions**:
1. Make sure MongoDB is running: `mongod --version`
2. Check if port 27017 is not blocked
3. For MongoDB Atlas: Check IP whitelist and connection string
4. Try: `mongodb://127.0.0.1:27017/jobtrackr` instead

### Port Already in Use

**Error**: `EADDRINUSE: port 5000 already in use`

**Solutions**:
1. Change PORT in `.env` to another value (e.g., 5001)
2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill
   ```

### Module Not Found Errors

**Error**: `Cannot find module...`

**Solution**:
```bash
rm -rf node_modules
npm install
```

### JWT Token Errors

**Error**: `Token is not valid`

**Solutions**:
1. Make sure `JWT_SECRET` is set in `.env`
2. Don't share JWT_SECRET between environments
3. For production, use a strong random secret

## Project Structure

```
backend/
├── models/
│   ├── Application.js    # Application schema
│   └── User.js           # User schema
├── routes/
│   ├── applications.js   # Application endpoints
│   └── auth.js           # Auth endpoints
├── middleware/
│   └── auth.js           # JWT authentication
├── scripts/
│   └── seed.js           # Database seeding
├── server.js             # Main server file
├── package.json
├── .env                  # Environment variables
└── README.md
```

## Production Deployment

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
MONGO_URI=<your-production-db-uri>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
FRONTEND_URL=<your-frontend-url>
```

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas with proper authentication
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS in production
- [ ] Rate limit your API endpoints
- [ ] Add input validation and sanitization
- [ ] Set up error logging (e.g., Winston)
- [ ] Use environment-specific configs

### Deployment Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Simple setup with database included
- **Render**: Free tier available
- **DigitalOcean**: App Platform
- **AWS**: Elastic Beanstalk or EC2

---

For more information, see [backend/README.md](backend/README.md)



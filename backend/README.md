# JobTrackr Backend API

RESTful API backend for the JobTrackr application tracker.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
```

### Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Database Setup

```bash
# Seed the database with sample data
npm run seed
```

## 📚 API Endpoints

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

### Health Check

- `GET /api/health` - Server health status

## 🔐 Authentication

All application endpoints require authentication via JWT token.

Include token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
backend/
├── models/
│   ├── Application.js    # Application model
│   └── User.js           # User model
├── routes/
│   ├── applications.js   # Application routes
│   └── auth.js           # Auth routes
├── middleware/
│   └── auth.js           # Auth middleware
├── scripts/
│   └── seed.js           # Database seeding
├── .env                  # Environment variables
├── server.js             # Main server file
└── package.json
```

## 🛠️ Technologies

- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- Bcrypt - Password hashing

## 📝 Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobtrackr
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 📊 Sample Requests

### Register User

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

### Create Application

```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "company": "Google",
    "role": "Frontend Developer",
    "status": "Applied",
    "location": "San Francisco, CA",
    "salary": 120000
  }'
```







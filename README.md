# 🎯 JobTrackr - Job Application Tracker

> **A beautiful, production-ready job application tracking system built with React 19, Tailwind CSS, and modern web technologies.**

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-blue.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Overview

JobTrackr is a comprehensive job application management system that helps job seekers track, analyze, and manage their applications. Built with modern best practices and production-ready features.


---

## 📸 Screenshots

### Login Page
![Homepage](./screenshots/loginpage.png)

### Dashboard 
![Editor](./screenshots/dashboard.png)

### Application Page
![Editor](./screenshots/applicationpage.png)

### Analytics Page
![Editor](./screenshots/analyticspage.png)

### Graph Page
![Editor](./screenshots/graph.png)

---


## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)



**Quick Steps:**

1. **Backend Setup**:
```bash
cd backend
npm install
# Configure .env file
npm run seed  # Optional: add sample data
npm run dev
```

2. **Frontend Setup** (in another terminal):
```bash
cd frontend
npm install
# Create .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
```

3. **Access**: http://localhost:5173

**Default Test Credentials**:
- Email: `test@example.com`
- Password: `password123`



## 🌟 Key Features

### 📊 Dashboard
- Real-time statistics and metrics
- Visual data representations
- Recent applications overview
- Quick insights

### 💼 Applications Management
- Full CRUD operations
- Advanced search and filtering
- Multiple sorting options
- Grid and list view modes
- Rich application details

### 📈 Analytics
- Comprehensive charts and graphs
- Success rate tracking
- Company-wise analysis
- Trend analysis over time

### 🔐 Authentication
- Beautiful login/register pages
- Mock authentication system
- Guest mode support
- User profile management

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Touch-friendly interface

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Validation**: Mongoose Validators

## 📁 Project Structure

```
ai-job-application-tracker/
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── contexts/        # State management
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utilities
│   ├── public/
│   └── package.json
│
├── backend/                 # Express API server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── scripts/             # Utilities
│   ├── server.js            # Main server
│   └── package.json
│
└── Documentation/
    ├── SETUP_GUIDE.md
    ├── BACKEND_SETUP.md
    └── README.md
```

## 🎨 Design Highlights

- **Modern UI**: Clean, intuitive interface
- **Color Scheme**: Professional blue palette
- **Icons**: 20+ Lucide React icons
- **Animations**: Smooth transitions
- **Responsive**: Mobile, tablet, desktop
- **Accessible**: WCAG compliant
- **Real-time**: Live data updates

## 📦 Available Scripts

### Frontend
```bash
cd frontend
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
```

### Backend
```bash
cd backend
npm run dev      # Development with auto-reload
npm start        # Production mode
npm run seed     # Seed sample data
```

## 🔧 Configuration

### Frontend Environment

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/jobtrackr
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Vite for the blazing fast build tool
- All the open-source contributors


**Built  for efficient job application tracking**






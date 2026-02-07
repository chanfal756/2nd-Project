# 🚢 LubeTrack Marine - Complete Vessel Operations System

A modern, full-stack **LubeTrack Marine** system with secure JWT authentication, built for ship captains and fleet managers.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**LubeTrack Marine** is a production-ready web application designed for maritime vessel operations. It provides a centralized platform for managing:

- **Daily Reports** - Submit and track noon reports, arrival/departure logs
- **Oil & Fuel Inventory** - Monitor fuel consumption and lubricating oils
- **Navigation & Routing** - Track vessel position, course, and waypoints
- **Crew Management** - Manage watch schedules and rest hour compliance
- **Maintenance Scheduling** - Plan and log preventive maintenance tasks
- **System Alerts** - Real-time notifications for critical events
- **User Settings** - Personalize preferences and account management

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** MongoDB (with in-memory fallback)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **Environment:** dotenv
- **Dev Tools:** nodemon

### **Frontend**
- **Framework:** React 19 (Vite)
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Alerts/Modals:** SweetAlert2
- **Icons:** Font Awesome 6

---

## ✨ Features

### **Authentication System**
✅ User Registration with validation  
✅ Secure Login with JWT tokens  
✅ Password hashing with bcrypt  
✅ Protected routes (frontend + backend)  
✅ Auto-redirect for authenticated users  
✅ Token-based session management  
✅ Logout functionality  

### **Dashboard Pages**
✅ **Dashboard** - Real-time vessel statistics and activities  
✅ **Daily Reports** - Report submission and approval tracking  
✅ **Oil Inventory** - Fuel levels and consumption monitoring  
✅ **Navigation** - Interactive map and course information  
✅ **Crew Management** - Watch schedules and rest hour tracking  
✅ **Maintenance** - PMS tasks and engine telemetry  
✅ **Alerts** - System notifications and warnings  
✅ **Settings** - User profile and preferences  

### **Key System Features**
🚀 **Mobile and desktop access** - Fully responsive UI for tablets, phones, and workstations.  
🔒 **Secure login and ship access** - Multi-tenant security ensuring data privacy per organization.  
📍 **GPS position recording** - Precise tracking of vessel coordinates and voyage progress.  
⛽ **Multiple fuel and oil types** - Support for HFO, LFO, MGO, and various lubricating oils.  
📊 **Real-time dashboard** - Live fleet analytics and operational status at a glance.  
📄 **PDF and Excel export** - Export compliance reports and operational logs with one click.  
🔔 **Automated notifications** - Smart threshold monitoring and instant system alerts.

### **📊 System Output & Reporting**
*   **Daily ship reports** - Structured digital logs for noon, arrival, and departure comms.
*   **Fleet performance summaries** - High-level analytics for executives and fleet managers.
*   **Fuel and oil consumption trends** - Interactive charts showing operational efficiency over time.
*   **Inventory and reorder alerts** - Automated warnings when consumables reach critical levels.
*   **Compliance and audit logs** - Immutable history of report approvals and system changes.

---

## 📂 Project Structure

```
maritime-dashboard/
│
├── backend/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection logic
│   │   ├── controllers/
│   │   │   └── authController.js  # Register, Login, GetMe
│   │   ├── middleware/
│   │   │   └── authMiddleware.js  # JWT verification
│   │   ├── models/
│   │   │   └── User.js         # Mongoose User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js   # /api/auth routes
│   │   │   └── userRoutes.js   # /api/users routes
│   │   └── app.js              # Express app setup
│   ├── .env                    # Environment variables
│   ├── .env.example            # Example env file
│   ├── server.js               # Server entry point
│   └── package.json
│
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # Top navigation bar
│   │   │   ├── Sidebar.jsx     # Left sidebar menu
│   │   │   └── ProtectedRoute.jsx  # Auth guard
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Registration page
│   │   │   ├── Dashboard.jsx   # Main dashboard
│   │   │   ├── Reports.jsx     # Daily reports
│   │   │   ├── Inventory.jsx   # Oil inventory
│   │   │   ├── Navigation.jsx  # Navigation & routing
│   │   │   ├── Crew.jsx        # Crew management
│   │   │   ├── Maintenance.jsx # Maintenance schedule
│   │   │   ├── AlertsPage.jsx  # System alerts
│   │   │   └── Settings.jsx    # User settings
│   │   ├── services/
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── App.jsx             # Main App + Routes
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind + Custom styles
│   ├── index.html              # HTML template
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js v18 or higher
- npm or yarn
- MongoDB (local or Atlas) - *Optional: In-memory DB is auto-configured*

### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd maritime-dashboard
```

### **2. Backend Setup**

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/maritime_dashboard
JWT_SECRET=your_super_secret_key_here_change_in_production
```

Start the backend:
```bash
npm run dev
```

Backend will run on: **http://localhost:5000**

### **3. Frontend Setup**

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🔐 Environment Variables

### **Backend (.env)**

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/maritime_dashboard` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_key_change_me` |

### **MongoDB Options**

**Option 1: Local MongoDB**
```env
MONGO_URI=mongodb://localhost:27017/maritime_dashboard
```

**Option 2: MongoDB Atlas (Cloud)**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/maritime_dashboard?retryWrites=true&w=majority
```

**Option 3: In-Memory (Auto-configured)**
- If no MongoDB is found, the system automatically uses an in-memory database
- Perfect for development/testing
- Data resets on server restart

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api
```

### **Authentication Endpoints**

#### **1. Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Captain John Smith",
  "email": "captain@oceanstar.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f8a3b2c1d4e5f6a7b8c9d0",
    "name": "Captain John Smith",
    "email": "captain@oceanstar.com",
    "role": "user"
  }
}
```

#### **2. Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "captain@oceanstar.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f8a3b2c1d4e5f6a7b8c9d0",
    "name": "Captain John Smith",
    "email": "captain@oceanstar.com",
    "role": "user"
  }
}
```

#### **3. Get Current User (Protected)**
```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "id": "65f8a3b2c1d4e5f6a7b8c9d0",
  "name": "Captain John Smith",
  "email": "captain@oceanstar.com",
  "role": "user",
  "createdAt": "2026-01-30T15:30:00.000Z"
}
```

#### **4. Get User Profile (Protected)**
```http
GET /api/users/profile
Authorization: Bearer <your-jwt-token>
```

### **Error Responses**

**Validation Error (400):**
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "message": "No token, authorization denied"
}
```

**Database Offline (503):**
```json
{
  "message": "Database is currently offline. Please start MongoDB or check your MONGO_URI."
}
```

---

## 🔑 Authentication Flow

### **Frontend → Backend JWT Flow**

1. **User Registration/Login**
   - User submits credentials via `Login.jsx` or `Register.jsx`
   - Form data sent to backend API (`/api/auth/login` or `/api/auth/register`)

2. **Backend Processing**
   - Validates input using `express-validator`
   - For Register: Hashes password with `bcryptjs`, saves to DB
   - For Login: Compares password hash
   - Generates JWT token with user ID

3. **Token Storage**
   - Frontend receives token + user data
   - Stores in `localStorage`:
     - `token` → JWT string
     - `user` → User object (name, email, role)

4. **Protected Requests**
   - Axios interceptor (`api.js`) attaches token to all requests:
     ```javascript
     Authorization: Bearer <token>
     ```

5. **Backend Verification**
   - `authMiddleware.js` extracts and verifies token
   - Decodes user ID and attaches to `req.user`

6. **Route Protection**
   - Frontend: `ProtectedRoute.jsx` checks for token
   - Backend: Routes with `authMiddleware` require valid token

---

## 📖 Usage Guide

### **1. Start the Application**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### **2. Access the Application**

Open your browser and navigate to:
```
http://localhost:5173
```

### **3. Create Your Account**

1. Click **"Register here"** on the login page
2. Fill in your details:
   - Full Name
   - Email Address
   - Password (min 6 characters)
   - Confirm Password
3. Click **Register**
4. You'll be automatically logged in and redirected to the Dashboard

### **4. Navigate the Dashboard**

Use the **sidebar** to access different sections:
- **Dashboard** - Overview of vessel operations
- **Daily Report** - Submit and view reports
- **Oil Inventory** - Monitor fuel levels
- **Navigation** - View course and position
- **Crew Management** - Manage crew schedules
- **Maintenance** - Track maintenance tasks
- **Alerts** - View system notifications
- **Settings** - Update your profile

### **5. Logout**

Click the **logout icon** in the sidebar (bottom-left corner)

---

## 📸 Screenshots

*(Add your actual screenshots here after deployment)*

**Login Page**
```
Professional maritime-themed login with email/password fields
```

**Dashboard**
```
Real-time statistics, voyage progress, and recent activities
```

**Navigation**
```
Interactive map with course information and weather data
```

---

## 🐛 Troubleshooting

### **Backend Issues**

**Port 5000 already in use:**
```bash
# Windows:
taskkill /F /IM node.exe

# Linux/Mac:
killall node
```

**MongoDB Connection Failed:**
- **Solution 1:** Start local MongoDB service
- **Solution 2:** Use MongoDB Atlas connection string
- **Solution 3:** The system will auto-fallback to in-memory DB

**JWT Token Invalid:**
- Check that `JWT_SECRET` is set in `.env`
- Clear browser localStorage and re-login

### **Frontend Issues**

**Tailwind CSS Not Working:**
```bash
cd frontend
npm install -D @tailwindcss/postcss
npm run dev
```

**Port 5173 already in use:**
```bash
# Kill Vite process
taskkill /F /FI "WINDOWTITLE eq Vite*"
```

**CORS Error:**
- Ensure backend is running on port 5000
- Check axios baseURL in `frontend/src/services/api.js`

---

## 🔒 Security Best Practices

✅ **JWT Secret:** Change `JWT_SECRET` to a strong random string in production  
✅ **Password Hashing:** Using bcrypt with salt rounds = 10  
✅ **Input Validation:** express-validator on all inputs  
✅ **HTTPS:** Use SSL/TLS in production  
✅ **Environment Variables:** Never commit `.env` to Git  

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Developer

**Powered by:** RapidBizz  
**Developed by:** Triplestack X  
**Project:** LubeTrack Marine  
**Version:** 2.1.0  
**Last Updated:** January 2026  

---

## 🚀 Deployment

### **Backend (Render / Railway / Heroku)**
1. Push code to GitHub
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

### **Frontend (Vercel / Netlify)**
1. Push code to GitHub
2. Connect repository
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## ✅ Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Two-factor authentication (2FA)
- [ ] Real-time notifications via WebSocket
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode theme

---

**Happy Sailing! ⚓🚢**

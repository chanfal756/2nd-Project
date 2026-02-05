# 🚢 Maritime Dashboard - Backend API

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.19-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green.svg)
![License](https://img.shields.io/badge/License-ISC-yellow.svg)

Professional backend API for Maritime Dashboard with complete authentication system, built following industry best practices.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Security Features](#security-features)
- [Development](#development)

---

## ✨ Features

- ✅ **Complete Authentication System** (Register, Login, Profile)
- ✅ **JWT Token-based Security**
- ✅ **Password Hashing** with bcrypt
- ✅ **Role-based Access Control** (User, Captain, Admin)
- ✅ **MongoDB Integration** with Mongoose ODM
- ✅ **CORS Enabled** for frontend communication
- ✅ **Security Headers** with Helmet
- ✅ **Request Logging** with Morgan
- ✅ **Error Handling** - Comprehensive and user-friendly
- ✅ **Input Validation** - Built-in Mongoose validators
- ✅ **Production Ready** - Scalable architecture

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin requests |
| **Helmet** | Security headers |
| **Morgan** | HTTP logging |
| **dotenv** | Environment management |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   └── auth.controller.js    # Authentication logic
│   ├── models/
│   │   └── user.model.js         # User schema & methods
│   ├── routes/
│   │   └── auth.routes.js        # Auth endpoints
│   ├── middlewares/
│   │   └── auth.middleware.js    # JWT verification
│   └── app.js                    # Express app config
├── server.js                      # Entry point
├── .env                          # Environment variables (create this)
├── .env.example                  # Config template
├── package.json                  # Dependencies
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your configuration
```

3. **Set Environment Variables**

Update `.env` with your actual values:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. **Start Development Server**

```bash
npm run dev
```

5. **Start Production Server**

```bash
npm start
```

---

## 📡 API Endpoints

### Health Check

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | Check API status |

**Response:**
```json
{
  "success": true,
  "message": "Maritime Dashboard API is running",
  "timestamp": "2026-02-03T12:30:00.000Z",
  "environment": "development"
}
```

---

### Authentication Routes

Base URL: `/api/auth`

#### 1. Register User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "vessel": "SS Atlantic",
  "role": "user"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f9a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "vessel": "SS Atlantic",
      "createdAt": "2026-02-03T12:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 2. Login User

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f9a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "vessel": "SS Atlantic"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 3. Get Current User (Protected)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f9a1b2c3d4e5f6g7h8i9j0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "vessel": "SS Atlantic",
      "isActive": true,
      "createdAt": "2026-02-03T12:30:00.000Z",
      "updatedAt": "2026-02-03T12:30:00.000Z"
    }
  }
}
```

---

#### 4. Update Profile (Protected)

**PUT** `/api/auth/update`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "vessel": "SS Pacific"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "65f9a1b2c3d4e5f6g7h8i9j0",
      "name": "John Updated",
      "email": "john.new@example.com",
      "role": "user",
      "vessel": "SS Pacific",
      "updatedAt": "2026-02-03T12:35:00.000Z"
    }
  }
}
```

---

## 🔒 Security Features

### 1. **Helmet** - Security Headers
- Protects against common web vulnerabilities
- Sets HTTP headers automatically

### 2. **CORS** - Cross-Origin Resource Sharing
- Configured to accept requests from frontend
- Whitelist specific origins

### 3. **JWT** - JSON Web Tokens
- Secure, stateless authentication
- Token expiration built-in
- Token verification on protected routes

### 4. **bcrypt** - Password Hashing
- One-way encryption (10 salt rounds)
- Automatic hashing via Mongoose pre-save middleware

### 5. **Input Validation**
- Mongoose schema validators
- Email format validation
- Required field checks

### 6. **Error Handling**
- Global error middleware
- No server crashes on errors
- Friendly error messages

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/maritime` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key_here` |
| `JWT_EXPIRE` | Token expiration time | `30d` |

---

## 👨‍💻 Development

### Run in Development Mode

```bash
npm run dev
```

This uses `nodemon` which auto-restarts the server on file changes.

### Run in Production Mode

```bash
npm start
```

### Testing API Endpoints

Use tools like:
- **Postman** - Visual API testing
- **Insomnia** - REST client
- **Thunder Client** - VS Code extension
- **cURL** - Command line

**Example cURL:**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔗 Connecting to Frontend

Your React frontend should:

1. **Store the base URL**
```javascript
const API_URL = 'http://localhost:5000/api';
```

2. **Include JWT token in requests**
```javascript
const token = localStorage.getItem('token');

fetch(`${API_URL}/auth/me`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

3. **Handle authentication flow**
- Store token after login/register
- Include token in protected requests
- Remove token on logout

---

## 📝 Next Steps

### Recommended Enhancements:

1. **Email Verification** - Send verification emails on registration
2. **Password Reset** - Forgot password functionality
3. **Refresh Tokens** - Automatic token renewal
4. **Rate Limiting** - Prevent brute force attacks
5. **Request Validation** - express-validator middleware
6. **API Documentation** - Swagger/OpenAPI docs
7. **Testing** - Unit & integration tests
8. **Logging** - Winston for production logging
9. **Monitoring** - Error tracking (Sentry)
10. **Deployment** - Docker, Heroku, or AWS

---

## 📄 License

ISC License

---

## 🤝 Support

For issues or questions:
- Check the error logs
- Review the code comments
- Consult MongoDB/Express documentation

---

**Built with ❤️ for Maritime Dashboard**

# 🔗 Frontend-Backend Connection Guide

## Quick Start

### 1. Ensure MongoDB is Running

**Option A: Using MongoDB Atlas (Recommended for Development)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `.env` file:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/maritime_dashboard?retryWrites=true&w=majority
```

**Option B: Using Local MongoDB**
- Ensure MongoDB is installed and running on your machine
- The default connection string is already set: `mongodb://localhost:27017/maritime_dashboard`

---

### 2. Backend Server Status

The backend should now be running on `http://localhost:5000`

#### Test Endpoints:

```bash
# Health Check
curl http://localhost:5000/health

# API Info
curl http://localhost:5000/api
```

Expected Response:
```json
{
  "success": true,
  "message": "Maritime Dashboard API is running",
  "timestamp": "2026-02-03T12:30:00.000Z"
}
```

---

## Frontend Integration

### Axios Configuration (Frontend)

Create `src/api/axios.js`:

```javascript
import axios from 'axios';

// Base URL for API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Frontend Environment Variables

Create `.env` in your **frontend** folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

### Usage Examples (React Frontend)

#### 1. Register User

```javascript
import api from './api/axios';

const handleRegister = async (formData) => {
  try {
    const response = await api.post('/auth/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      vessel: formData.vessel,
    });

    // Store token
    localStorage.setItem('token', response.data.data.token);
    
    console.log('User registered:', response.data.data.user);
    // Redirect to dashboard
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message);
  }
};
```

---

#### 2. Login User

```javascript
import api from './api/axios';

const handleLogin = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    // Store token
    localStorage.setItem('token', response.data.data.token);
    
    console.log('Login successful:', response.data.data.user);
    // Redirect to dashboard
  } catch (error) {
    console.error('Login error:', error.response?.data?.message);
  }
};
```

---

#### 3. Get Current User (Protected Route)

```javascript
import api from './api/axios';

const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    
    console.log('Current user:', response.data.data.user);
    return response.data.data.user;
  } catch (error) {
    console.error('Get user error:', error.response?.data?.message);
  }
};
```

---

#### 4. Logout

```javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
};
```

---

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. **Check FRONTEND_URL in backend `.env`**
```env
FRONTEND_URL=http://localhost:5173
```

2. **Restart backend server** after changing `.env`

3. **Check browser console** for specific CORS messages

---

### Connection Refused Errors

1. **Ensure both servers are running:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

2. **Check terminal logs** for error messages

3. **Verify MongoDB connection:**
   - Backend logs should show "MongoDB Connected"
   - If not, check `MONGO_URI` in `.env`

---

### Token Errors

1. **Check token storage:**
```javascript
const token = localStorage.getItem('token');
console.log('Token:', token);
```

2. **Verify token is included in requests:**
   - Open browser DevTools → Network tab
   - Click on API request
   - Check "Headers" section for `Authorization: Bearer <token>`

3. **Token expiration:**
   - Default expiration is 30 days
   - Login again if token has expired

---

## API Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Testing the Connection

### Using Browser Console

```javascript
// Test API connection
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => console.log(data));

// Test registration
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Complete Flow

1. **User Registers** → Receives token → Stores in localStorage
2. **User Logs In** → Receives token → Stores in localStorage
3. **Protected Requests** → Token sent in Authorization header
4. **Backend Verifies** → Checks JWT → Returns user data
5. **User Logs Out** → Token removed from localStorage

---

## Security Checklist

✅ Passwords are hashed with bcrypt  
✅ JWT tokens expire after 30 days  
✅ CORS is configured for specific frontend origin  
✅ Helmet sets security HTTP headers  
✅ Tokens are stored in localStorage (not cookies)  
✅ Protected routes verify token before access  

---

## Next Steps

1. ✅ Backend API is ready
2. ✅ CORS is configured
3. ➡️ Integrate with React frontend
4. ➡️ Add error handling in UI
5. ➡️ Implement authentication flow
6. ➡️ Create protected routes in frontend
7. ➡️ Add user context/state management

---

**Your backend is now ready to connect with your React frontend! 🚀**

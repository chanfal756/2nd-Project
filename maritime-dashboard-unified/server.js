require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect to Database (With In-Memory Fallback)
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({ 
  contentSecurityPolicy: false // Allows external fonts/icons
}));
app.use(morgan('dev'));

// 📁 Static Folder (Serves your HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🔌 API Routes
app.use('/api/auth', require('./routes/auth.js'));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'server is running' }));

// Handle SPA (Returns index.html for any other route)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Captain Dashboard Server running on port ${PORT}`);
    console.log(`🔗 Access it at: http://localhost:${PORT}`);
});

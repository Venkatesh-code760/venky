const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getStatus } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from server directory or root directory
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB (with in-memory fallback)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes per SRS specifications
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/places', require('./routes/places'));
app.use('/api/recommendations', require('./routes/places')); // SRS 5.3 endpoint alias
app.use('/api/chat', require('./routes/chat'));
app.use('/api/feedback', require('./routes/feedback'));

// Health & System Info Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Travel Planner Backend API is healthy & operational',
    dbStatus: getStatus(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI Travel Planner API running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=======================================================`);
});

module.exports = app;

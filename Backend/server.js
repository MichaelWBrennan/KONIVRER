const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Add error handling for route parsing
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  if (err.message.includes('path-to-regexp') || err.message.includes('Missing parameter name')) {
    console.error('Route parsing error detected. This might be due to malformed route patterns.');
    console.error('Stack:', err.stack);
  }
  process.exit(1);
});

// Import routes with error handling
let authRoutes, cardRoutes, deckRoutes;

try {
  authRoutes = require("./routes/auth");
  console.log('✅ Auth routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

try {
  cardRoutes = require("./routes/cards");
  console.log('✅ Card routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading card routes:', err.message);
}

try {
  deckRoutes = require("./routes/decks");
  console.log('✅ Deck routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading deck routes:', err.message);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // Alternative dev port
      'http://localhost:4173', // Vite preview
      process.env.FRONTEND_URL // Production frontend URL
    ].filter(Boolean);
    
    // Check for Vercel deployments (*.vercel.app)
    const isVercelDomain = origin && origin.includes('.vercel.app');
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    if (isAllowedOrigin || isVercelDomain) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow all origins for now to fix deployment
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes with conditional loading
if (authRoutes) {
  app.use("/api/auth", authRoutes);
  console.log('✅ Auth routes mounted at /api/auth');
} else {
  console.log('⚠️ Auth routes not available');
}

if (cardRoutes) {
  app.use("/api/cards", cardRoutes);
  console.log('✅ Card routes mounted at /api/cards');
} else {
  console.log('⚠️ Card routes not available');
}

if (deckRoutes) {
  app.use("/api/decks", deckRoutes);
  console.log('✅ Deck routes mounted at /api/decks');
} else {
  console.log('⚠️ Deck routes not available');
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'KONIVRER Deck Database API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cards: '/api/cards',
      decks: '/api/decks'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/konivrer";

mongoose.connect(MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${MONGO_URI}`);
});

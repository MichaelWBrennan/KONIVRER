const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import routes
const authRoutes = require("./routes/auth");
const cardRoutes = require("./routes/cards");
const deckRoutes = require("./routes/decks");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Vercel frontend
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'https://*.vercel.app',  // Vercel preview deployments
    process.env.FRONTEND_URL // Production frontend URL
  ].filter(Boolean),
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/decks", deckRoutes);

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

mongoose.connect(MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${MONGO_URI}`);
});

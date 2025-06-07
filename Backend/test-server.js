const express = require("express");
const app = express();

// Basic middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server working' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});
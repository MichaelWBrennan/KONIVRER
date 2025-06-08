const express = require('express');
const { getCards, syncCards, testConnection } = require('../controllers/cardController');
const router = express.Router();

// Get all cards (with caching and fallback)
router.get('/', getCards);

// Manual sync from Google Sheets
router.post('/sync', syncCards);

// Test Google Sheets connection
router.get('/test-connection', testConnection);

module.exports = router;

const express = require('express');
const { getCards } = require('../controllers/cardController');
const router = express.Router();

router.get('/', getCards);

module.exports = router;

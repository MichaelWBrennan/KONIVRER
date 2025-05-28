const express = require("express");
const router = express.Router();
const Deck = require("../models/Deck");

// Get all decks
router.get("/", async (req, res) => {
  const decks = await Deck.find();
  res.json(decks);
});

// Create deck
router.post("/", async (req, res) => {
  const deck = new Deck(req.body);
  await deck.save();
  res.status(201).json(deck);
});

module.exports = router;
  

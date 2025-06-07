const express = require("express");
const router = express.Router();
const { 
  getDecks, 
  createDeck, 
  getDeck, 
  updateDeck, 
  deleteDeck 
} = require("../controllers/deckController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes (no auth required for demo)
router.get("/", async (req, res) => {
  try {
    const Deck = require("../models/Deck");
    const decks = await Deck.find();
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const Deck = require("../models/Deck");
    const deck = new Deck(req.body);
    await deck.save();
    res.status(201).json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes (require authentication)
// Uncomment these when authentication is needed
// router.use(authMiddleware);
// router.get("/", getDecks);
// router.post("/", createDeck);
// router.get("/:id", getDeck);
// router.put("/:id", updateDeck);
// router.delete("/:id", deleteDeck);

module.exports = router;
  

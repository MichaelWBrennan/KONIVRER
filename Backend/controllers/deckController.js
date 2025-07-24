const Deck = require('../models/Deck');

exports.getDecks = async (req, res) => {
    const decks = await Deck.find({ owner: req.user.id });
    res.json(decks);
};

exports.createDeck = async (req, res) => {
    const deck = await Deck.create({ ...req.body, owner: req.user.id });
    res.status(201).json(deck);
};

exports.getDeck = async (req, res) => {
    const deck = await Deck.findOne({ _id: req.params.id, owner: req.user.id });
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck);
};

exports.updateDeck = async (req, res) => {
    const deck = await Deck.findOneAndUpdate(
        { _id: req.params.id, owner: req.user.id },
        req.body,
        { new: true }
    );
    res.json(deck);
};

exports.deleteDeck = async (req, res) => {
    await Deck.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    res.status(204).end();
};

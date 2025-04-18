const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    name: String,
    cards: Array,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Deck', deckSchema);

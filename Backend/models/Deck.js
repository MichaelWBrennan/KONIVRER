const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    name: String,
    cards: Array,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        body: String,
        createdAt: { type: Date, default: Date.now }
    }],
    public: { type: Boolean, default: false }, // privacy/sharing
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deck', deckSchema);

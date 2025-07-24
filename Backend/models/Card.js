// You can expand this model as needed
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    name: String,
    elements: [String],
    type: String,
    rarity: String
});

module.exports = mongoose.model('Card', cardSchema);

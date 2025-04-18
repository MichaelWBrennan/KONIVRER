const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const deckRoutes = require('./routes/decks');
const cardRoutes = require('./routes/cards');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/cards', cardRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server running');
        });
    })
    .catch(err => console.error(err));

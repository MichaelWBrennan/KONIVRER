const express = require("express");
const mongoose = require("mongoose");
const deckRoutes = require("./routes/deckRoutes");
const app = express();

app.use(express.json());
app.use("/api/decks", deckRoutes);

mongoose.connect("mongodb://localhost/konivrer", { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(5000, () => console.log("Server running on port 5000"));

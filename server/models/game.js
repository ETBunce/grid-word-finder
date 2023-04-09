const mongoose = require('mongoose')

const PlayerSchema = mongoose.Schema({
    name: String,
    words: [String],
    score: Number
})

const GameSchema = mongoose.Schema(
    {
        players: [PlayerSchema],
        grid: String,
        startTime: Number
    }
);

const AppGameSchema = mongoose.model("game", GameSchema);

module.exports = AppGameSchema;
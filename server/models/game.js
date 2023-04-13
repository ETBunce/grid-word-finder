const mongoose = require('mongoose')

const PlayerSchema = mongoose.Schema({
    name: String,
    words: [String],
    score: Number,
    ready: Boolean
});

const ScoreEventSchema = mongoose.Schema({
    playerName: String,
    word: String,
    score: Number
});

const GameSchema = mongoose.Schema(
    {
        players: [PlayerSchema],
        scoreEvents: [ScoreEventSchema],
        grid: String,
        startTime: Number,
        hostPlayerName: String,
        canJoin: Boolean
    }
);

const AppGameSchema = mongoose.model("game", GameSchema);

module.exports = AppGameSchema;
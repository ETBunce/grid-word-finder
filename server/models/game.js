const mongoose = require('mongoose')

const PlayerSchema = mongoose.Schema({
    name: String,
    words: [String],
    score: Number,
    ready: Boolean
});

const GameSchema = mongoose.Schema(
    {
        players: [PlayerSchema],
        grid: String,
        startTime: Number,
        hostPlayerName: String,
        canJoin: Boolean,
        stage: String // Could be equal to Lobby, Starting, Playing
    }
);

const AppGameSchema = mongoose.model("game", GameSchema);

module.exports = AppGameSchema;
const mongoose = require('mongoose')

const PlayerSchema = mongoose.Schema({
    name: String,
    ready: Boolean
})

const LobbySchema = mongoose.Schema(
    {
        players: [PlayerSchema],
    }
);

const AppLobby = mongoose.model("lobby", LobbySchema);

module.exports = AppLobby;
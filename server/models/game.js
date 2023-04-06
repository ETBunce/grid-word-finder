const mongoose = require('mongoose')

const GameSchema = mongoose.Schema(
    {
        state: {
            type: Document,
            required: true
        }
    }
)

const AppGameSchema = mongoose.model("game", GameSchema);

module.exports = AppGameSchema;
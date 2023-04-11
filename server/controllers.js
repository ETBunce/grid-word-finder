const gameLogic = require('./game-logic');

exports.getGrid = (req, res)=> {
    res.send(gameLogic.requestGameGrid(req, res));
}

exports.getPlayerScores = (req, res) => {
    res.send(gameLogic.requestPlayerScores(req, res));
}
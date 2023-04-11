const gameLogic = require('./game-logic');

exports.getGrid = (req, res)=> {
    res.send(gameLogic.requestGameGrid(req, res));
}
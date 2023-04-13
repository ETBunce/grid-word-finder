const gameLogic = require('./game-logic');

exports.getGrid = (req, res)=> {
    gameLogic.requestGameGrid(req, res);
}

exports.getPlayerScores = (req, res) => {
    gameLogic.requestPlayerScores(req, res);
}

exports.submitWord = (req, res) => {
    gameLogic.submitWord(req, res);

}
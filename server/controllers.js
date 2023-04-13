const gameLogic = require('./game-logic');
const AppGame = require('./models/game');

exports.getGrid = (req, res)=> {
    res.send(gameLogic.requestGameGrid(req, res));
}

exports.getPlayerScores = (req, res) => {
    res.send(gameLogic.requestPlayerScores(req, res));
}

exports.getLobbyList = (req, res) => {
    AppGame.find({canJoin: true})
    .then((lobbies) => {
        let list = [];
        for (let i = 0; i < lobbies.length; i++ ) {
            list.push(lobbies[i].hostPlayerName);
        }
        res.send(list);
    })
    .catch((err) => {
        console.log('error searching database for lobbies: ' , err);
    })
}
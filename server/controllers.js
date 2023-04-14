const gameLogic = require('./game-logic');
const AppGame = require('./models/game');

exports.getGrid = (req, res)=> {
    gameLogic.requestGameGrid(req, res);
}

exports.getPlayerScores = (req, res) => {
    gameLogic.requestPlayerScores(req, res);
}

exports.submitWord = (req, res) => {
    gameLogic.submitWord(req, res);

}

exports.getLobbyList = (req, res) => {
    AppGame.find({canJoin: true})
    .then((lobbies) => {
        let list = [];
        for (let i = 0; i < lobbies.length; i++ ) {
            list.push({
                name: lobbies[i].hostPlayerName,
                gameId: lobbies[i]._id
            });
        }
        res.send(list);
    })
    .catch((err) => {
        console.log('error searching database for lobbies: ' , err);
    })
}

exports.joinGame = (req, res) => {
    gameLogic.joinGame(req.body.name, req.body.gameId, (result)=> {
        if (result.success) {
            console.log('success joining game!');
        } else {
            console.log('failed to join game');
        }
        res.send(result);
    })
}

exports.newGame = (req, res) => {
    console.log('new game requested');
    gameLogic.createNewGame(req.body.playerName, (result) => {
        res.send(result);
    });
}
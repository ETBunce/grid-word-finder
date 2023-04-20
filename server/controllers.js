const gameLogic = require('./game-logic');
const AppGame = require('./models/game');

exports.getGame = async (req, res)=> {
    await gameLogic.requestGameGrid(req, res);
}

exports.getPlayerScores = async (req, res) => {
    await gameLogic.requestPlayerScores(req, res);
}

exports.submitWord = async (req, res) => {
    await gameLogic.submitWord(req, res);

}

exports.getLobbyList = async (req, res) => {
    await AppGame.find({canJoin: true})
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

exports.leaveGame = async (req, res) => {
    await gameLogic.leaveGame((result) => {
        res.send(result);
    });
}

exports.newGame = async (req, res) => {
    // console.log('new game requested');
    await gameLogic.createNewGame(req.body.playerName, (result) => {
        res.send(result);
    });
}

exports.getLobbyState = async (req, res) => {
    // console.log('got request to get lobby players');
    await gameLogic.requestLobbyState(req, res);
}

exports.setReady = async (req, res) => {
    // console.log('got request to set ready: ' , req.body.ready);
    await gameLogic.setReady(req.body.ready, (result) => {
        // console.log('got result: ', result);
        res.send(result);
    });
}
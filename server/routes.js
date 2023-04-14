const express = require('express');

const router = express.Router();

const controllers = require("./controllers.js");

router.get("/game", controllers.getGrid);

router.get('/', (req, res)=> { res.send('Hello , world!'); });
router.get('/getGrid', controllers.getGrid);
router.get('/playerScores', controllers.getPlayerScores);
router.get('/lobbies', controllers.getLobbyList);
router.get('/lobbyPlayers', controllers.getLobbyPlayers);

router.post('/submitWord', controllers.submitWord);
router.post('/joinGame', controllers.joinGame);
router.post('/newGame', controllers.newGame);
router.post('/setReady', controllers.setReady);

/*
example result for get /playerScores:
[ // An array of players
    { // A player
        name: String,
        words: [String], // An array of words the user has guessed
        score: Number
    },
    { // Another player
        name: String,
        words: [String],
        score: Number
    }
]
*/


// ROUTES FOR TESTING
router.get('/lobbyListSample', (req, res) => {
    res.send([
        {name: 'Bob', gameId: '_idlskjdfopajbidj'},
        {name: 'Kevin', gameId: '_idlssdsew234lvkjopeijajbidj'}
    ])
});

router.get('/gridSample', (req, res) => {
    // Send an example grid, which is a 16-character string
    res.send('RAMFCEKOTHVUSBAD');
});

router.get('/playerScoresSample', (req, res) => { // Used for testing
    res.send([
        {
            name: 'Bob',
            words: [
                'HAMMER',
                'WALLET'
            ],
            score: 500
        },
        {
            name: 'Kevin',
            words: [
                'FLOWER',
                'BUMBLEBEE'
            ],
            score: 400
        }
    ]);
});

module.exports = router;

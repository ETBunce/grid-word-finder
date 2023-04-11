const express = require('express');

const router = express.Router();

const controllers = require("./controllers.js");

router.get('/', (req, res)=> { res.send('Hello , world!'); });
router.get('/getGrid', controllers.getGrid);
router.get('/playerScores', controllers.getPlayerScores);
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
})
/*
example result:
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

module.exports = router;

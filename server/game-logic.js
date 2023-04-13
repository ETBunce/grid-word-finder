const AppGame = require('./models/game');

const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
const GRID_WIDTH = 4;
const GRID_HEIGHT = 4;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

let gameId = '';
let myName = '';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function generateGrid() {

    const numVowels = 6 + getRandomInt(2); // Produces 6 or 7
    let gridArray = [];
    let openSlots = [];

    function takeRandomOpenSlot() {
        const slotIndex = getRandomInt(openSlots.length);
        const slot = openSlots[slotIndex]
        openSlots.splice(slotIndex, 1); // Deletes the slot from the open slots
        return slot;
    }

    // Populate the open slots
    for (let i = 0; i < GRID_SIZE; i++) {
        openSlots.push(i);
    }

    // Put in the vowels
    for (let i = 0; i < numVowels; i++) {
        const slot = takeRandomOpenSlot();
        gridArray[slot] = VOWELS[getRandomInt(VOWELS.length)];
    }

    // Put in the consonants
    const numRemainingSlots = openSlots.length;
    for (let i = 0; i < numRemainingSlots; i++ ) {
        const slot = takeRandomOpenSlot();
        gridArray[slot] = CONSONANTS[getRandomInt(CONSONANTS.length)];
    }

    // Convert the array to a string
    let gridString = '';
    for(let i = 0; i < gridArray.length; i++) {
        gridString += gridArray[i];
    }
    return gridString;

}

//TODO: Test this function
// 
function withGame(func, errorFunc) {
    AppGame.findOne({_id:gameId})
    .then((game) => {
        func(game);
        game.save();
    })
    .catch((err) => {
        console.log('error finding game: ' + err.message);
        errorFunc && errorFunc(err);
    });
}

//TODO: Test this function
function withPlayer(playerName, func, errorFunc) {
    withGame((game) => {
        const player = game.players.find((name) => name === playerName);
        if (player) {
            func(player);
        }
    }, errorFunc)
}

function addScoreEvent(playerName, score) {
    withGame((game) => { // Do this
        game.scoreEvents.push({playerName: playerName, score: score});
    },
    () => { // Error

    });
}

function addPlayer(game, playerName) {
    if (game.players.includes(playerName)) {
        return false;
    } else {
        game.players.push({
            name: playerName,
            words: [],
            score: 0,
            ready: false
        });
        return true;
    }
}

exports.createNewGame = (hostPlayerName) => {

    gameId = '';

    // const grid = generateGrid();

    const newGame = {
        players:[],
        grid:'',
        startTime: 0,
        hostPlayerName: hostPlayerName,
        canJoin: true
    }

    addPlayer(newGame, hostPlayerName);

    AppGame.create(newGame)
    .then((game) => {
        console.log('created a game:' + game);
        myName = hostPlayerName;
        gameId = game._id;

        //TEST:
        withGame((game)=> {
            console.log('doing a thing with game: ', game._id);
        })
        ///////////////
    })
    .catch((err) => {
        console.log('error creating game: ', err);
    })
}

exports.startGame = () => {

}

exports.joinGame = (name, joinGameId, resultFunc) => {
    AppGame.findOne({_id: joinGameId})
    .then((game) => {
        const success = addPlayer(game, name);
        if (success) {
            gameId = joinGameId;
            myName = name;
            resultFunc({success: true});
        } else {
            resultFunc({success: false, message: 'player name ' + name + ' is taken'});
        }
    })
    .catch((err) => {
        resultFunc({success: false, message: 'game does not exist'});
    })
}

exports.submitWord = (playerName, word) => {
    //TODO: check if the word is valid and give the player points

    //TEST:
    addScoreEvent(playerName, word.length); // Just for testing, score is not equal to word length
    // withGame((game)=> {
    //     console.log('doing a thing with game: ', game._id);
    // })
    ///////////////
}


// CONTROLLER INTERFACE

exports.requestGameGrid = (req, res) => {
    withGame((game) => {
        res.send(game.grid);
    });
}

exports.requestPlayerScores = (req, res) => {
    withGame((game) => {
        res.send(game.players);
    })
}
const AppGame = require('./models/game');
const axios = require('axios');


const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
const GRID_WIDTH = 4;
const GRID_HEIGHT = 4;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
const MAX_PLAYERS = 4;
const MIN_PLAYERS = 1; // TODO: Change this to 2 when done testing

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
function withPlayer(func, errorFunc) {
    withGame((game) => {
        const player = game.players.find((player) => player.name === myName);
        if (player) {
            func(player);
        } else {
            console.log('could not find player: ', myName);
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

    if (!game.canJoin) {
        return false;
    }

    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i].name === playerName) {
            return false;
        }
    }

    game.players.push({
        name: playerName,
        words: [],
        score: 0,
        ready: false
    });

    if (game.players.length >= MAX_PLAYERS) {
        game.canJoin = false;
    }

    game.save();
    return true;
}

exports.createNewGame = (hostPlayerName, resultFunc) => {

    gameId = '';

    // const grid = generateGrid();

    const newGame = {
        players:[],
        grid:'',
        startTime: 0,
        hostPlayerName: hostPlayerName,
        canJoin: true
    }

    AppGame.create(newGame)
    .then((game) => {
        console.log('created a game:' + game);
        myName = hostPlayerName;
        gameId = game._id;
        addPlayer(game, hostPlayerName);
        resultFunc({success: true, gameId: gameId});
    })
    .catch((err) => {
        console.log('error creating game: ', err);
        resultFunc({success: false});
    })
}

exports.startGame = () => {

}

exports.joinGame = (name, joinGameId, resultFunc) => {
    AppGame.findOne({_id: joinGameId})
    .then((game) => {
        if (game.players.length >= MAX_PLAYERS) { // can only join if there is room in the lobby
            resultFunc({success: false, message: 'lobby is full', lobbyFull: true});
            return;
        }
        const success = addPlayer(game, name);
        if (success) {
            gameId = joinGameId;
            myName = name;
            resultFunc({success: true});
        } else {
            resultFunc({success: false, message: 'player name ' + name + ' is taken', nameTaken: true});
        }
    })
    .catch((err) => {
        resultFunc({success: false, message: 'game does not exist', noGame: true});
    })
}

exports.submitWord = async (req, res) => {
    const guessedWord = req.body.word;
    console.log("Player sent word: \"%s\"", guessedWord);
    let responseToPlayer = {
        success: false,
        err: "Unknown Error Occurred"
    };

    await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/" + guessedWord)
        .then((res) => {
            console.log("Response from datamsue: %s", JSON.stringify(res.data));
            responseToPlayer = {
                success: true,
                validWord: true
            };
        })
        .catch((err) => {
            if (err.response.data.title === "No Definitions Found") {
                console.log("Word is invalid");
                responseToPlayer = {
                    success: true,
                    validWord: false
                };
            } else {
                console.log("Error sending request to datamuse. Error: %s", err.message);
                responseToPlayer = {
                    success: false,
                    err: "Please check server console for error!"
                };
            }
        })
    res.send(responseToPlayer);
}

exports.setReady = (ready, resultFunc) => {
    withPlayer((player) => {
        // console.log('setting ready with player: ', myName);
        player.ready = ready;
        resultFunc({success: true, ready: ready});
    }, err => console.log('error setting ready: ', err));
}

exports.getMaxPlayers = () => MAX_PLAYERS;
exports.getMinPlayers = () => MIN_PLAYERS;

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

exports.requestLobbyPlayers = (req, res) => {
    withGame((game) => {
        res.send(game.players);
    })
}
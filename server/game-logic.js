const AppGame = require('./models/game');
const axios = require('axios');
const fs = require("fs");


const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
const GRID_WIDTH = 4;
const GRID_HEIGHT = 4;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
const MAX_PLAYERS = 4;
const MIN_PLAYERS = 1; // TODO: Change this to 2 when done testing

let gameId = '';
let myName = '';

// PULLS IN LIST OF VALID WORDS INTO MEMORY
let validWords;

fs.readFile("assets/words.txt", "utf-8", function(err, data) {
    if (err) { console.log("Error reading file: %s", err); }
    else {
        validWords = data.split('\n');
        for (let i = 0; i < validWords.length; i++) {
            validWords[i] = validWords[i].replace("\r", "").replace("\n", "");
        }
        console.log("Successfully pulled in %s valid words (assets/words.txt) file.", validWords.length);
    }
})

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
    if (gameId === '') {
        console.log('withGame: current gameId is blank.');
        return false;
    }
    AppGame.findOne({_id:gameId})
    .then((game) => {
        func(game);
        game.save();
    })
    .catch((err) => {
        console.log('error working with game: ' + err.message);
        errorFunc && errorFunc(err);
    });
    return true; // Indicates the current game id has been set
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
        canJoin: true,
        stage: 'Lobby'
    }

    AppGame.create(newGame)
    .then((game) => {
        console.log('created a game');
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
            resultFunc({success: true, hostPlayerName: game.hostPlayerName});
        } else {
            resultFunc({success: false, message: 'player name ' + name + ' is taken', nameTaken: true});
        }
    })
    .catch((err) => {
        resultFunc({success: false, message: 'game does not exist', noGame: true});
    })
}

exports.submitWord = (req, res) => {
    const guessedWord = req.body.word;

    let responseToPlayer = {
        success: false,
        validWord: false
    };

    if (
        guessedWord.length > 2
        && validWords.includes(guessedWord.toLowerCase()) // check in-mem valid words file
    ) {
        responseToPlayer.success = true;
        responseToPlayer.validWord = true;
        console.log("Player sent word: \"%s\" which is a valid word", guessedWord);

        // add to player's score, etc.
    } else {
        console.log("Player sent word: \"%s\" which is an invalid word", guessedWord);
        responseToPlayer.success = true;
        responseToPlayer.validWord = false;
    }

    res.send(responseToPlayer);
}

// Game starts here if all players are ready
exports.setReady = (ready, resultFunc) => {
    withGame((game) => {
        if (game.stage !== 'Lobby') return;
        const player = game.players.find((player) => player.name === myName);
        if (player) {
            player.ready = ready;
        }
        let allReady = true;
        for (let i = 0; i < game.players.length; i++) {
            if (!game.players[i].ready) {
                allReady = false;
                break;
            }
        }
        if (allReady) {
            game.stage = 'Starting';
            setTimeout(()=>{
                game.stage = 'Playing';
                game.grid = generateGrid();
                game.save();
            }, 3000);
        }
        resultFunc({success: true, ready: ready});
    })
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

exports.requestLobbyState = (req, res) => {
    withGame((game) => {
        let players = [];
        for (let i = 0; i < game.players.length; i++) {
            players.push({name:game.players[i].name, ready: game.players[i].ready});
        }
        res.send({stage: game.stage, players: players});
    })
}
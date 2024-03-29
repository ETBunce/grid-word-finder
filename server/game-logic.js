const AppGame = require('./models/game');
const fs = require("fs");


const VOWELS = 'AEIOU';
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXYZ';
const GRID_WIDTH = 4;
const GRID_HEIGHT = 4;
const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
const MAX_PLAYERS = 4;
const MIN_PLAYERS = 2;
const GAME_MATCH_TIME = 60;
const GAME_DELETE_AGE = 10; // seconds

let gameId = '';
let myName = '';

let validWordsFile;
let currentGameGrid = "RAMFCEKOTHVUSBAD";  // change this when not testing... or not, I'm not your parent.
let currentWordsGuessed = [];
let currentScore = 0;

fs.readFile("assets/words.txt", "utf-8", function(err, data) {
    if (err) { console.log("Error reading file: %s", err); }
    else {
        validWordsFile = data.split('\n');
        for (let i = 0; i < validWordsFile.length; i++) {
            validWordsFile[i] = validWordsFile[i].replace("\r", "").replace("\n", "");
        }
        // console.log("Successfully pulled in %s valid words (assets/words.txt) file.", validWordsFile.length);
    }
})

// TODO - DELETE ALL GAMES IN DB THAT ARE EXPIRED

function getGameAgeSeconds(game) {
    return (Date.now() - game.startTime) / 1000;
}

AppGame.find({stage: 'Playing'}) // Add a condition here to check game.startTime is too old
    .then((games) => {
        // console.log('checking games to delete: ');
        for (let i = 0; i < games.length; i++) {
            // console.log('game age: ', getGameAgeSeconds(games[i]));
            if (getGameAgeSeconds(games[i]) > GAME_MATCH_TIME + GAME_DELETE_AGE) {
                // console.log('game is old, deleting ', games[i].id);
                AppGame.deleteOne({_id:games[i]._id})
                .then(() => {
                    // console.log('deleted the game');
                });
            }
        }
    })
    .catch(err => console.log('error finding games to delete: ' , err.message));

function isGameOver(game) {
    // console.log('checking game over. game age (seconds): ', (Date.now() - game.startTime) / 1000);
    return (Date.now() - game.startTime) > GAME_MATCH_TIME * 1000;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function startGame(game) {
    game.stage = 'Playing';
    game.grid = generateGrid();
    game.startTime = Date.now();
}

function updateLobby(game) {
    // console.log('updating lobby');
    if (game.players.length < 1) {
        // console.log('last player, deleting game');
        AppGame.deleteOne({_id: game._id})
            .then((game) => {
                // console.log('deleted game');
            })
            .catch(err => console.log('error deleting game: ', err.message));
        return 'DeadGame';
    }
    // console.log('players still remain, checking all ready');
    let allReady = true;
    for (let i = 0; i < game.players.length; i++) {
        if (!game.players[i].ready) {
            allReady = false;
            break;
        }
    }
    if (allReady) {
        game.canJoin = false;
        game.stage = 'Starting';
        setTimeout(()=>{
            startGame(game);
            console.log('game was started, grid is' , game.grid);
            game.save();
        }, 3000);
        return 'Starting';
    }
    return '';
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
async function withGame(func, errorFunc, doNotSave) {
    try {
        if (gameId === '') {
            // console.log('withGame: current gameId is blank.');
            return false;
        }
        await AppGame.findOne({_id: gameId})
            .then((game) => {
                func(game);
                if (!doNotSave) game.save();
            })
            .catch((err) => {
                console.log('error working with game: ' + err.message);
                errorFunc && errorFunc(err);
            });
        return true; // Indicates the current game id has been set
    } catch (err) {
        console.log("An error occurred within withGame: %s", err.message);
    }
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

exports.createNewGame = async (hostPlayerName, resultFunc) => {

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
        // console.log('created a game');
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

exports.submitWord = async (req, res) => {
    // console.log("player name: %s", myName);
    // Make sure we have current game grid
    let gameOver = false;
    let currGame = null;
    await AppGame.findOne({_id: gameId})
        .then((game) => {
            currentGameGrid = game.grid;
            gameOver = isGameOver(game);
            currGame = game;
        })
        .catch((err) => {
            console.log("Error getting game: %s", err.message);
        })

    const guessedWord = req.body.word;
    const validWordScoreMatrix = [1, 2, 4, 7, 11, 16];

    let responseToPlayer = {
        success: false,
        validWord: false,
        player1Score: NaN,
        player2Score: NaN,
        player3Score: NaN,
        player4Score: NaN,
        earnedPoints: 0
    };

    if (
        guessedWord.length > 2
        && validWordsFile.includes(guessedWord.toLowerCase()) // check in-mem valid words file
        && validateWord(guessedWord)
        && !currentWordsGuessed.includes(guessedWord)
        && !gameOver
    ) {
        let earnedScore = guessedWord.length > 8 ? 22 : validWordScoreMatrix[guessedWord.length - 3];
        currentScore += earnedScore;
        currentWordsGuessed.push(guessedWord);
        // console.log("Player sent word: \"%s\" which is a valid word and earned %s points. New player score: %s", guessedWord, earnedScore, currentScore);

        responseToPlayer.success = true;
        responseToPlayer.validWord = true;
        responseToPlayer.earnedPoints = earnedScore;
        responseToPlayer.wordsGuessed = currentWordsGuessed;

        for (let i = 0; i < currGame.players.length; i++) {
            if (currGame.players[i].name === myName) {
                currGame.players[i].score = currentScore;
                currGame.players[i].words = currentWordsGuessed;
            } else {
                switch (i) {
                    case 0: responseToPlayer.player1Score = currGame.players[i].score; break;
                    case 1: responseToPlayer.player2Score = currGame.players[i].score; break;
                    case 2: responseToPlayer.player3Score = currGame.players[i].score; break;
                    case 3: responseToPlayer.player4Score = currGame.players[i].score; break;
                }
            }
        }

        await AppGame.findOneAndUpdate({_id: gameId}, {
            players: currGame.players,
            grid: currGame.grid,
            startTime: currGame.startTime,
            hostPlayerName: currGame.hostPlayerName,
            canJoin: currGame.canJoin,
            state: currGame.state
        })
        .then((obj) => {
            console.log("Successfully updated obj!")
        })
        .catch((err) => {
            console.log("Error updating obj! %s", err.message);
        })
    } else {
        // console.log("Player sent word: \"%s\" which is an invalid word", guessedWord);
        responseToPlayer.success = true;
        responseToPlayer.validWord = false;
    }
    responseToPlayer.playerGuessedWords = currentWordsGuessed;
    res.send(responseToPlayer);

}


function validateWord(wordToValidate) {
    let currInx = currentGameGrid.indexOf(wordToValidate[0]);
    while (currInx >= 0) {
        if (traverseWord(currInx, 0, wordToValidate)) break;
        currInx = currentGameGrid.indexOf(wordToValidate[0], currInx + 1);
    }

    return currInx >= 0;
}

function traverseWord(currItr, currLetterItr, wordToCheck, visitedStates=[]) {
    let newVisitedStates = visitedStates.slice();
    if (newVisitedStates.includes(currItr)) return false;
    newVisitedStates.push(currItr);
    if (wordToCheck[currLetterItr].toUpperCase() === currentGameGrid[currItr].toUpperCase()) {
        if (++currLetterItr === wordToCheck.length) return true;
    } else return false;

    // traverse using recursion
    // right
    if (((currItr + 1) % 4) > 0 && traverseWord(currItr + 1, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // left
    else if (((currItr % 4) - 1) >= 0  && traverseWord(currItr - 1, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // up
    else if ((currItr - 4) >= 0 && traverseWord(currItr - 4, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // down
    else if ((currItr + 4) < 16 && traverseWord(currItr + 4, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // upper-right
    else if ((currItr - 4) >= 0 && (currItr - 3) % 4 > 0 && traverseWord(currItr - 3, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // upper-left
    else if ((currItr - 4) >= 0 && ((currItr  - 4) % 4) - 1 >= 0 && traverseWord(currItr - 5, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // lower-right
    else if ((currItr + 4) < 16 && ((currItr + 5) % 4) - 1 >= 0 && traverseWord(currItr + 5, currLetterItr, wordToCheck, newVisitedStates)) return true;

    // lower-left
    else if ((currItr + 4) < 16 && ((currItr + 4) % 4) - 1 >= 0 && traverseWord(currItr + 3, currLetterItr, wordToCheck, newVisitedStates)) return true;

    else return false;
}

// Game starts here if all players are ready
exports.setReady = async (ready, resultFunc) => {
    await withGame((game) => {
        if (game.stage !== 'Lobby') return;
        const player = game.players.find((player) => player.name === myName);
        if (player) {
            player.ready = ready;
        }
        updateLobby(game);
        resultFunc({success: true, ready: ready});
    })

    // set currentGameGrid to make it more easily accessible
    currentWordsGuessed = [];
    currentScore = 0;
    await withGame((game) => {
        currentGameGrid = game.grid;
    })
}

exports.leaveGame = async (resultFunc) => {
    const leaveName = myName;
    await withGame((game) => {

        if (game.stage != 'Lobby') {
            return;
        }

        for (let i = 0; i < game.players.length; i++) {
            if (game.players[i].name === leaveName) {
                game.players.splice(i,1);
                // console.log('successfuly removed ', leaveName, ' from the game');
            }
        }

        if (updateLobby(game) === 'DeadGame') {
            resultFunc();
            return;
        }
        
        if(game.stage === 'Lobby' && game.players.length < MAX_PLAYERS) {
            game.canJoin = true;
        }

        resultFunc();
        game.save();
    }, null, true);
    gameId = '';
    myName = '';

}

exports.getMaxPlayers = () => MAX_PLAYERS;
exports.getMinPlayers = () => MIN_PLAYERS;

// CONTROLLER INTERFACE

exports.requestGameGrid = async (req, res) => {
    await withGame((game) => {
            res.json({
                grid: game.grid,
                players: game.players
            });
    });
}

exports.requestPlayerScores = async (req, res) => {
    await withGame((game) => {
        res.send(game.players);
    })
}

exports.requestLobbyState = async (req, res) => {
    await withGame((game) => {
        let players = [];
        for (let i = 0; i < game.players.length; i++) {
            players.push({name:game.players[i].name, ready: game.players[i].ready});
        }
        res.send({stage: game.stage, players: players});
    })
}
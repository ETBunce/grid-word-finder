import { useState, useEffect } from "react";
import axios from "axios";

export function GridGame() {
    const [board, setBoard] = useState([]);
    const [word, setWord] = useState("");
    const [wordError, setWordError] = useState("");
    const [wordErrorFound, setWordErrorFound] = useState(false);
    const [wordList, setWordList] = useState([]);
    const [wordListString, setWordListString] = useState("");
    const [status, setStatus] = useState("");
    const [playerScore, setPlayerScore] = useState(0);

    // get function gets game board, players
    useEffect(() => {
        axios.get("http://localhost:4000/gridSample")
        // axios.get("http://localhost:4000/game") - Use this line when no longer testing - Ethan
        .then((res) => {
            setBoard(res.data);
            // next will need to set the players and player scores
        })
        .catch(err => console.log(err));
    }, []);

    // onclick function for buttons change what is in the form
    function handleClick(e) {
        setWord(word + board[e]);
    }

    // onclick undo button
    function undoClick() {
        setWord(word.substring(0, word.length-1));
    }

    // runs whenever word changes, checks validity of word
    useEffect(() => {
        if(word !== "" && word.length > 2){
            let lastLetter = "";
            let lastLetterIndexes = [];
            let currentLetterIndexes = [];
            let letterFound = false;
            let indexesUsed = [];
            for (let i = 0; i < word.length; i++){
                // checks if letter is in the board
                if (board.includes(word[i])){
                    setWordError("");
                } else {
                    setWordError("Letter " + word[i] + " is not on the board."); // errors if letter not in the board
                    break;
                }
                // compares the letter to surrounding letters
                if(i === 0){
                    lastLetter = word[i]; // sets the first letter
                    lastLetterIndexes = [];
                    for(let t = 0; t < 16; t++){
                        if(board[t] === lastLetter){
                            lastLetterIndexes.push(t); // find all instances of the letter on the grid
                        }
                    }
                } else {
                    letterFound = false;
                    currentLetterIndexes = [];
                    for(let t = 0; t < 16; t++){
                        if(board[t] === word[i]){
                            currentLetterIndexes.push(t); // find all instances of current letter on grid
                        }
                    }
                    for(let o = 0; o < currentLetterIndexes.length; o++){
                        for (let j = 0; j < lastLetterIndexes.length; j++){
                            for(let k = 0; k < 8; k++){
                                let cases = [
                                    [currentLetterIndexes[o], lastLetterIndexes[j] + 1],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] - 1],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] + 4],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] - 4],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] + 3],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] - 3],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] + 5],
                                    [currentLetterIndexes[o], lastLetterIndexes[j] - 5],
                                ];
                                const [a, b] = cases[k];
                                if(a === b
                                    && !letterFound // makes sure a check doesn't run twice
                                    && indexesUsed.indexOf(a) === -1 // checks a letter hasn't been used already
                                ){
                                    if((k === 0) && (a % 4 === 0) && ((b - 1) % 4 === 3)){break;} // check horizontal cases
                                    else if((k === 1) && (a % 4 === 3) && ((b + 1) % 4 === 0)){break;} // check horizontal cases
                                    else if((k === 4) && (a % 4 === 3) && ((b - 3) % 4 === 0)){break;} // check diagonal cases
                                    else if((k === 5) && (a % 4 === 0) && ((b + 3) % 4 === 3)){break;} // check diagonal cases
                                    else if((k === 6) && (a % 4 === 0) && ((b - 5) % 4 === 3)){break;} // check diagonal cases
                                    else if((k === 7) && (a % 4 === 3) && ((b + 5) % 4 === 0)){break;} // check diagonal cases
                                    else {
                                        setWordError("");
                                        indexesUsed.push(a); // add to list of letters used
                                        indexesUsed.push(lastLetterIndexes[j]); // ensures the last letter is pushed as well
                                        lastLetter = word[i]; // set new last letter
                                        lastLetterIndexes = [a]; // set the index of last letter
                                        letterFound = true;
                                    } // end else
                                } // end if
                            } // end inner inner for loop
                        } // end inner for loop
                    } // end outer for loop
                    if(!letterFound){
                        setWordError("Word is not valid.");
                        break;
                    }
                } // end else
            } // end for
        } else {
            setWordError("Word is not long enough.");
        }
    }, [word]);

    // runs if a word error is found, sets error found to true.
    // separate variables like this ensure the page updates
    useEffect(() => {
        if(wordError !== ""){
            setWordErrorFound(true);
        } else {
            setWordErrorFound(false);
        }
    }, [wordError])

    // handles word submission
    function handleSubmit(e){
        e.preventDefault();
        if(!wordList.includes(word)){
            // post method to submit word

            // then if word is confirmed a real word
            // increase player score
            let pointsGained = increaseScore();
            setPlayerScore(playerScore + pointsGained);
            // add word to the display list
            setWordList([...wordList, word]);
            setStatus("Word found! " + pointsGained + " points added!");
        } else{
            setStatus("Word already used!");
        }
    }

    function increaseScore(){
        if(word.length === 3){return 1;}
        else if (word.length === 4){return 2;}
        else if (word.length === 5){return 4;}
        else if (word.length === 6){return 7;}
        else if (word.length === 7){return 11;}
        else if (word.length === 8){return 16;}
        else if (word.length > 8){return 22;}
    }

    useEffect(() => {
        if(wordList.length > 0){
            if(wordList.length === 1) {setWordListString(word);}
            else {setWordListString(wordListString + ", " + word);}
        }
        setWord("");
    }, [wordList])

    function handleChange(e) {
        let value = "";
        value = e.target.value;
        value = value.toUpperCase();
        setWord(value);
    }

    return (
        <center>
            <h1>Grid Word Find</h1><br />
            <div className="row">
                <div className="col-md-3"><h2>This Player</h2><h3>{playerScore}</h3></div>
                <div className="col-md-3"><h2>Player 2</h2><h3>Score</h3></div>
                <div className="col-md-3"><h2>Player 3</h2><h3>Score</h3></div>
                <div className="col-md-3"><h2>Player 4</h2><h3>Score</h3></div>
            </div><br /><br />
            <div className="row">
                <div className="col-md-4">
                    <div id = "grid">
                        <button onClick={() => handleClick(0)}>{board[0]}</button>
                        <button onClick={() => handleClick(1)}>{board[1]}</button>
                        <button onClick={() => handleClick(2)}>{board[2]}</button>
                        <button onClick={() => handleClick(3)}>{board[3]}</button>
                        <br />
                        <button onClick={() => handleClick(4)}>{board[4]}</button>
                        <button onClick={() => handleClick(5)}>{board[5]}</button>
                        <button onClick={() => handleClick(6)}>{board[6]}</button>
                        <button onClick={() => handleClick(7)}>{board[7]}</button>
                        <br />
                        <button onClick={() => handleClick(8)}>{board[8]}</button>
                        <button onClick={() => handleClick(9)}>{board[9]}</button>
                        <button onClick={() => handleClick(10)}>{board[10]}</button>
                        <button onClick={() => handleClick(11)}>{board[11]}</button>
                        <br />
                        <button onClick={() => handleClick(12)}>{board[12]}</button>
                        <button onClick={() => handleClick(13)}>{board[13]}</button>
                        <button onClick={() => handleClick(14)}>{board[14]}</button>
                        <button onClick={() => handleClick(15)}>{board[15]}</button>
                    </div><br />
                    <button onClick={() => undoClick()}>Undo</button><br /><br />
                </div>
                <div className="col-md-4">
                    <form onSubmit={handleSubmit} noValidate>
                        <label>Enter a word from the grid:</label><br />
                        <input
                            type="text"
                            name="word"
                            value={word}
                            onChange={handleChange}
                        /><br /><br />
                        <button type="submit" disabled={wordErrorFound}>
                            Submit word
                        </button>
                    </form><br /> <br />
                    {wordErrorFound ? <p>{wordError}</p> : null}<br />
                    <p>{status}</p>
                </div>
                <div className="col-md-4">
                    <h2>Your words</h2>
                    <p>{wordListString}</p>
                </div>
            </div>
        </center>
    );
}

export default GridGame;
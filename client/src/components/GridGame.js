import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function GridGame() {
    const [board, setBoard] = useState("");
    const [word, setWord] = useState("");
    const [wordError, setWordError] = useState("");
    const [wordErrorFound, setWordErrorFound] = useState(false);
    const [wordList, setWordList] = useState([]);
    const [wordListString, setWordListString] = useState("");
    const [playerScore, setPlayerScore] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player3Score, setPlayer3Score] = useState(0);
    const [player4Score, setPlayer4Score] = useState(0);
    const [playerName, setPlayerName] = useState("Player 1");
    const [player2Name, setPlayer2Name] = useState("Player 2");
    const [player3Name, setPlayer3Name] = useState("");
    const [player4Name, setPlayer4Name] = useState("");
    const [gameTimer, setGameTimer] = useState(60);
    const [validWord, setValidWord] = useState(false);
    const [wordSuccess, setWordSuccess] = useState("Word is valid!");

    const navigate = useNavigate();


    // get function gets game board, players
    useEffect(() => {
        axios.get("http://localhost:4000/getGame")
        .then((res) => {
            console.log(res.data);
            // set the grid
            setBoard(res.data.grid);
            // set the players
            setPlayerName(res.data.players[0].name);
            setPlayer2Name(res.data.players[1].name);
            if(res.data.players.length > 2){
                setPlayer3Name(res.data.players[2].name);
            }
            if(res.data.players.length > 3){
                setPlayer4Name(res.data.players[3].name);
            }
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(()=> {
        const gameDataInterval = setInterval(() => {
            axios.get('http://localhost:4000/playerScores')
            .then((res) => {
                // update the game data here
                setPlayerScore(res.data[0].score);
                setPlayer2Score(res.data[1].score);
                if(res.data.length > 2){
                    setPlayer3Score(res.data[2].score);
                }
                if(res.data.length > 3){
                    setPlayer4Score(res.data[3].score);
                }
            })
            .catch((err) => {
                console.log('error getting game data: ', err.message);
            })
        }, 500);

        let timer = 60;
        const gameTimerInterval = setInterval(() => {
            if (timer > 0) setGameTimer(--timer);
            if(timer <= 0) navigate('/results');
        }, 1000);

        return(()=>{
            clearInterval(gameDataInterval);
            clearInterval(gameTimerInterval);
        });
    }, [])

    // onclick function for buttons change what is in the form
    function handleClick(e) {
        setWord(word + board[e]);
    }

    // onclick undo button
    function undoClick() {
        setWord(word.substring(0, word.length-1));
    }

    function validateWord(wordToValidate) {
        let currInx = board.indexOf(wordToValidate[0]);
        while (currInx >= 0) {
            if (traverseWord(currInx, 0, wordToValidate)) break;
            currInx = board.indexOf(wordToValidate[0], currInx + 1);
        }

        return currInx >= 0;
    }

    function traverseWord(currItr, currLetterItr, wordToCheck, visitedStates=[]) {
        let newVisitedStates = visitedStates.slice();
        if (newVisitedStates.includes(currItr)) return false;
        newVisitedStates.push(currItr);
        if (wordToCheck[currLetterItr].toUpperCase() === board[currItr].toUpperCase()) {
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

    // runs whenever word changes, checks validity of word
    useEffect(() => {
        if(word.length > 2 && validateWord(word)){
            setWordError("");
        } else {
            setWordError("Word is not valid!");
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
        setValidWord(false);
        if(!wordList.includes(word)){
            // post method to submit word
            axios.post("http://localhost:4000/submitWord", {word: word})
            .then((res) => {
                if(res.data.validWord){
                    setWordSuccess("Word found! " + res.data.earnedPoints + " points added!");
                    setValidWord(true);
                    // add word to the display list
                    setWordList([...wordList, word]);
                } else {
                    setWordError("Not a valid word!");
                    setWordErrorFound(true);
                }
            })
            .catch((err) => {
                console.log("Error couldn't send word.");
                console.log(err.message);
            });
        } else{
            setWordError("Word already used!");
            setWordErrorFound(true);
        }
    }

    useEffect(() => {
        if(wordList.length > 0){
            if(wordList.length === 1) {setWordListString(word);}
            else {setWordListString(wordListString + ", " + word);}
        }
        setWord("");
    }, [wordList])

    function handleChange(e) {
        setValidWord(false);
        e.target.value = e.target.value.trim();
        let value = "";
        value = e.target.value;
        value = value.toUpperCase();
        setWord(value);
    }

    return (
        <center>
            <h1>Grid Word Find</h1><br />
            <div className="row">
                <div className="col-md-3"><h2>{playerName}</h2><h3>{playerScore}</h3></div>
                <div className="col-md-3"><h2>{player2Name}</h2><h3>{player2Score}</h3></div>
                {player3Name !== "" ? <div className="col-md-3"><h2>{player3Name}</h2><h3>{player3Score}</h3></div> : null}
                {player4Name !== "" ? <div className="col-md-3"><h2>{player4Name}</h2><h3>{player4Score}</h3></div> : null}
            </div><br /><br />
            <div className="row">
                <div className="col-lg-4">
                    <div id = "grid">
                        <div className={"btn-group"}>
                            <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(0)}>{board[0]}</button>
                            <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(1)}>{board[1]}</button>
                            <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(2)}>{board[2]}</button>
                            <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(3)}>{board[3]}</button>
                        </div>
                        <br />
                        <div className={"btn-group"}>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(4)}>{board[4]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(5)}>{board[5]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(6)}>{board[6]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(7)}>{board[7]}</button>
                        <br />
                        </div>
                            <div className={"btn-group"}>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(8)}>{board[8]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(9)}>{board[9]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(10)}>{board[10]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(11)}>{board[11]}</button>
                        <br />
                            </div>
                                <div className={"btn-group"}>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(12)}>{board[12]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(13)}>{board[13]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(14)}>{board[14]}</button>
                        <button type={"button"} className={"btn btn-light btn-outline-dark btn-lg"} onClick={() => handleClick(15)}>{board[15]}</button>
                                </div>
                                </div><br />
                    <button type={"button"} className={"btn btn-warning"} onClick={() => undoClick()}>Undo</button><br /><br />
                    <div>
                        <div className="progress" style={{height: "25px"}}>
                            <div
                                className={gameTimer > 15 ? "progress-bar progress-bar-striped progress-bar-animated bg-success" :
                                    gameTimer > 5 ? "progress-bar progress-bar-striped progress-bar-animated bg-warning" :
                                        "progress-bar progress-bar-striped progress-bar-animated bg-danger"}
                                 style={{width: ((gameTimer / 60 * 100).toString() + "%")}}>
                            </div>
                        </div>
                        <h5>Time remaining: {gameTimer}</h5>
                    </div>
                </div>
                <div className="col-md-4">

                    <form onSubmit={handleSubmit} noValidate>
                        <div className={"form-group"}>
                            <label>Enter a word from the grid:</label><br />
                            <input className={validWord ? "form-control is-valid" : wordErrorFound ? "form-control is-invalid" : "form-control"} type="text" name="word" value={word} onChange={handleChange} required={true}/>
                            <div className="valid-feedback">{wordSuccess}</div>
                            <div className="invalid-feedback">{wordError}</div>
                            <br /><br />
                            <button className={"btn btn-success"} type="submit" disabled={wordErrorFound}>
                                Submit word
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-4">
                    <div className={"card"}>
                        <div className={"card-header"}>
                            <h2>Your words</h2>
                        </div>
                        <div className={"card-body"}>
                            <h5>{wordListString}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </center>
    );
}

export default GridGame;
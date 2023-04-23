import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Results() {
    const [players, setPlayers] = useState([]);
    const [winnerName, setWinnerName] = useState("");
    let navigate = useNavigate();
    const validWordScoreMatrix = [1, 2, 4, 7, 11, 16];

    let winner = "";
    let winnerScore = 0;

    function returnToLobby() {
        axios.post("http://localhost:4000/leaveGame")
        .catch((err) => {
            console.log("Error leaving game: " + err.message);
        });
        navigate("../");
    }

    useLayoutEffect(
        function() {
            axios.get("http://localhost:4000/playerScores")
            .then((res) => {
                if(res.data != null) {
                    setPlayers(res.data);
                
                    winner = (res.data[0].name);
                    winnerScore = res.data[0].score;
                    for(let i = 1; i < res.data.length; i++) {
                        if(res.data[i].score > winnerScore) {
                            winner =(res.data[i].name);
                            winnerScore = res.data[i].score;
                        }
                        else if(res.data[i].score === winnerScore) {
                            winner = (winner + " and " + res.data[i].name);
                            if(winnerScore === 0) {
                                winner = "You all suck";
                            }
                        }
                    }
                }
                setWinnerName(winner);
            })
            .catch((err) => {
                console.log("Error showing results" + err.message);
            });
        },
        []
    );

    return (
        <center>
            <h1 className="mb-5 mt-5 display-4">Game Over!</h1>
            <div className="card">
                <div className="card-header">
                    <div className="card-title"><h4>Game Results</h4></div>
                </div>
                <div className="card-body">
                    <div className="card-deck">
                        {players.map((singlePerson, index) => (
                            <div className={singlePerson.name === winnerName ? "card shadow-lg" : "card"}>
                                {singlePerson.name === winnerName ?
                                    <div className="card-header bg-success text-light">
                                        <h4>WINNER!</h4>
                                    </div>
                                    : null
                                }
                                <div className="card-body">
                                    <h4>Player <strong>{singlePerson.name}</strong></h4>
                                    <h6>Words Found:</h6>
                                    <ul className="list-group">
                                        {singlePerson.words.length > 0 ? singlePerson.words.map((singleWord, index) => (
                                            <li className="list-group-item d-flex justify-content-between align-items-left" key={index}>
                                                {singleWord}
                                                <span className="badge badge-success">{singleWord.length > 8 ? 22 : validWordScoreMatrix[singleWord.length - 3]}</span>
                                            </li>
                                        )) : <p className="text-danger">Player couldn't find any words!</p>}
                                    </ul>
                                </div>
                                <div className="card-footer">
                                    <div id="score"><h6>Score: {singlePerson.score}</h6></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-footer">
                    <h5>{winner === "You all suck" || winner === "" ? "No one won. You all suck" : "Thanks for playing!"}</h5>
                </div>
            </div>
            <div id="bottom">
                <button className="btn btn-primary" type="button" id="RTL" onClick={returnToLobby}>Return to Lobby</button>
            </div>
        </center>
    );
}

export default Results;
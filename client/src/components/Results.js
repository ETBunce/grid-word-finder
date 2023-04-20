import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Results() {
    const [players, setPlayers] = useState([{name: "", words: [""], score: 0}]);
    const [winnerName, setWinnerName] = useState("");
    let navigate = useNavigate();

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
            <h1>Results</h1>
            {players.map((singlePerson, index) => (
                <div key={index} id="player">
                    <div id="name">Name: {singlePerson.name}</div>
                    <h3>Words Found:</h3>
                    <ul id="words">
                        {singlePerson.words.map((singleWord, index) => (
                            <li key={index}>{singleWord}</li>
                        ))}
                    </ul>
                    <div id="score">Score: {singlePerson.score}</div>
                </div>
            ))}
            <div id="bottom">
                <h2>Winner</h2>
                <div id="winner">{winnerName}</div>
                <button type="button" id="RTL" onClick={returnToLobby}>Lobby List</button>
            </div>
        </center>
    );
}

export default Results;
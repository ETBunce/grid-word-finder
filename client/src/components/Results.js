import { useState, useLayoutEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Results() {
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState();

    let winnerScore = 0;

    function ready() {
        axios.post("http://localhost:4000/ready", true)
        .catch((err) => {
            console.log("Error showing results" + err.message);
        });
    }

    useLayoutEffect(
        function() {
            axios.get("http://localhost:4000/playerScoresSample")
            .then((res) => {
                setPlayers(res.data);
                
               setWinner(res.data[0].name);
                winnerScore = res.data[0].score;
                for(let i = 1; i < res.data.length; i++) {
                    if(res.data[i].score > winnerScore) {
                        setWinner(res.data[i].name);
                        winnerScore = res.data[i].score;
                    }
                }
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
            {players.map((singlePerson) => (
                <div id="player">
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
                <div id="winner">{winner}</div>
                <button type="button" id="ready" onClick={ready}>Ready</button>
            </div>
        </center>
    );
}

export default Results;
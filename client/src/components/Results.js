import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Results() {
    const [names, setNames] = useState([]);
    const [words, setWords] = useState([]);
    const [scores, setScores] = useState([]);

    function playAgain() {
        /* 
        axios.get("http://localhost:4000/startGame")
        .then((res) =>{
            if(res.body != "") {
                navigate("../GridGame");
            }
        })
        .catch((err) => {
            console.log("Error playing again" + err.message);
        });
        */
    }

    useEffect(
        function() {
            axios.get("http://localhost:4000/Results")
            .then((res) => {
                setNames(res.data.names);
                setWords(res.data.words);
                setScores(res.data.scores);

                document.getElementById("names").innerHTML = (names.map((singleName) =>(<div>{singleName}</div>)));
                document.getElementById("words").innerHTML = (words.map((playersWords) =>(<div>{playersWords}</div>)));
                document.getElementById("scores").innerHTML = (scores.map((singleScore) =>(<div>{singleScore}</div>)));
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
            <div id="names">Couldn't find Names</div>
            <div id="words">Couldn't find Words List</div>
            <div id="scores">Couldn't find Scores</div>
            <div id="winner">Couldn't find Winner</div>
            <button type="button" id="playAgain" onClick={playAgain}>Play Again</button>
        </center>
    );
}

export default Results;
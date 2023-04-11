import { useState, useEffect } from "react";
import axios from "axios";

export function GridGame() {
    const [board, setBoard] = useState([]);

    // get function gets game board, players
    useEffect(() => {
        axios.get("http://localhost:4000/game")
        .then((res) => {
            setBoard(res.data.letters);
        })
        .catch(err => console.log(err));
    }, []);

    // onclick function for buttons do a post method

    return (
        <center>
            <h1>Main Game</h1>
            <button>{board[0]}</button>
            <button>{board[1]}</button>
            <button>{board[2]}</button>
            <button>{board[3]}</button>
            <button>{board[4]}</button>
            <button>{board[5]}</button>
        </center>
    );
}

export default GridGame;
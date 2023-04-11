import { useState, useEffect } from "react";
import axios from "axios";

export function GridGame() {
    const [board, setBoard] = useState([]);
    const [grid, setGrid] = useState("");

    // get function gets game board, players
    useEffect(() => {
        axios.get("http://localhost:4000/gridSample")
        // axios.get("http://localhost:4000/game") - Use this line when no longer testing - Ethan
        .then((res) => {
            // setGrid(res.data); // Old - Ethan
            setBoard(res.data); // New - Ethan
        })
        .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        setBoard(board => [...board, grid.split("")]);
    }, [grid]);

    // onclick function for buttons do a post method

    return (
        <center>
            <h1>Main Game</h1>
            <div id = "grid">
                <button>{board[0]}</button>
                <button>{board[1]}</button>
                <button>{board[2]}</button>
                <button>{board[3]}</button>
                <br />
                <button>{board[4]}</button>
                <button>{board[5]}</button>
                <button>{board[6]}</button>
                <button>{board[7]}</button>
                <br />
                <button>{board[8]}</button>
                <button>{board[9]}</button>
                <button>{board[10]}</button>
                <button>{board[11]}</button>
                <br />
                <button>{board[12]}</button>
                <button>{board[13]}</button>
                <button>{board[14]}</button>
                <button>{board[15]}</button>
            </div>
        </center>
    );
}

export default GridGame;
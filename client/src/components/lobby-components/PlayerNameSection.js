import axios from "axios";
import PlayerNameForm from "./PlayerNameForm";
import { useState } from "react";

function PlayerNameSection(props) {
    const sleep = async (milliseconds) => {
        await new Promise(resolve => {
            return setTimeout(resolve, milliseconds)
        });
    };
    
    async function createLobby(playerName) {
        console.log('posting to newGame');
        await axios.post('http://localhost:4000/newGame', {playerName:playerName})
        .then(async (res) => {
            console.log('got a response from post to newGame: ', res);
            document.getElementById("submit-btn").innerHTML = "Submit";
            document.getElementById("invalid-feedback").innerHTML = "Please fill out this field.";
            document.getElementById("name-field").className = "form-control is-valid";
            await sleep(1000);
            props.goTo('LobbyRoom', {hostName: playerName});
        })
        .catch((err) => {
            console.log('error creating new game: ' , err);
            document.getElementById("invalid-feedback").innerHTML = "An unknown error occurred. Please refresh and try again.";
            document.getElementById("name-field").className = "form-control is-invalid";
        });
    }

    async function joinLobby(playerName) {
        console.log('player name submitted: ' + playerName);
        console.log('joining game id: ', props.options.gameIdToJoin);
        await axios.post('http://localhost:4000/joinGame', {name: playerName, gameId: props.options.gameIdToJoin})
            .then(async (res) => {
                console.log('got a response from joinGame: ', res.data);
                document.getElementById("submit-btn").innerHTML = "Submit";
                if (res.data.success) {
                    document.getElementById("invalid-feedback").innerHTML = "Please fill out this field.";
                    document.getElementById("name-field").className = "form-control is-valid";
                    console.log('going to lobby room. host name is ' , res.data.hostPlayerName);
                    await sleep(1000);
                    props.goTo('LobbyRoom', {hostName: res.data.hostPlayerName} );
                } else if (res.data.nameTaken) {
                    console.log('name is taken');
                    document.getElementById("invalid-feedback").innerHTML = "Name is already taken! Please try another.";
                    document.getElementById("name-field").className = "form-control is-invalid";
                    document.getElementById("submit-btn").disabled = true;
                } else if (res.data.lobbyFull) {
                    console.log('lobby is full');
                    document.getElementById("invalid-feedback").innerHTML = "Lobby is full! Please exit and select another game or host your own.";
                    document.getElementById("name-field").className = "form-control is-invalid";
                    document.getElementById("submit-btn").disabled = true;
                } else if (res.data.noGame) {
                    console.log('no game');
                    document.getElementById("invalid-feedback").innerHTML = "This game already started or no longer exists! Please exit and select another game or host your own.";
                    document.getElementById("name-field").className = "form-control is-invalid";
                    document.getElementById("submit-btn").disabled = true;
                }
            })
            .catch((err) => {
                console.log('error joining game: ' , err.message);
                document.getElementById("invalid-feedback").innerHTML = "Something went wrong. Please refresh and try again.";
                document.getElementById("name-field").classList.add("is-invalid");
            })
    }

    async function handleSubmit(playerName) {
        document.getElementById("submit-btn").disabled = true;
        document.getElementById("submit-btn").innerHTML = "<span class='spinner-border spinner-border-sm text-primary'></span> Loading..."
        await sleep(1000);
        if (props.options.newGame) {
            await createLobby(playerName);
        } else {
            await joinLobby(playerName);
        }
        document.getElementById("submit-btn").innerHTML = "Submit";
    }

    console.log('new game is: ', props.options.newGame);
    return(<div>
        <PlayerNameForm handleSubmit={handleSubmit}/>
        <button className={'btn btn-warning'} onClick={()=>{props.goTo('LobbyList')}}>Back</button>
    </div>)

}

export default PlayerNameSection;
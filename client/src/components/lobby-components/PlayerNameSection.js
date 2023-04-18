import axios from "axios";
import PlayerNameForm from "./PlayerNameForm";
import { useState } from "react";

function PlayerNameSection(props) {

    const [showNameTakenHint, setShowNameTakenHint] = useState(false);
    
    function createLobby(playerName) {
        console.log('posting to newGame');
        axios.post('http://localhost:4000/newGame', {playerName:playerName})
        .then((res) => {
            console.log('got a response from post to newGame: ', res);
            props.goTo('LobbyRoom', {hostName: playerName});
        })
        .catch((err) => {
            console.log('error creating new game: ' , err);
        });
    }

    function joinLobby(playerName) {
        console.log('player name subitted: ' + playerName);
        console.log('joining game id: ', props.options.gameIdToJoin);
        setShowNameTakenHint(false);
        axios.post('http://localhost:4000/joinGame', {name: playerName, gameId: props.options.gameIdToJoin})
            .then((res) => {
                console.log('got a response from joinGame: ', res.data);
                if (res.data.success) {
                    console.log('going to lobby room. host name is ' , res.data.hostPlayerName);
                    props.goTo('LobbyRoom', {hostName: res.data.hostPlayerName} );
                } else if (res.data.nameTaken) {
                    console.log('name is taken');
                    setShowNameTakenHint(true);
                } else if (res.data.lobbyFull) {
                    console.log('lobby is full');
                    //TODO: do something if the lobby is full
                } else if (res.data.noGame) {
                    console.log('no game');
                    //TODO: do something if no game exists
                }
            })
            .catch((err) => {
                console.log('error joining game: ' , err.message);
            })
    }

    function handleSubmit(playerName) {
        if (props.options.newGame) {
            createLobby(playerName);
        } else {
            joinLobby(playerName);
        }
    }

    console.log('new game is: ', props.options.newGame);
    return(<div>
        <PlayerNameForm handleSubmit={handleSubmit}/>
        <br/>
        {showNameTakenHint ? <div>Name is taken, try another</div> : null}
        <button onClick={()=>{props.goTo('LobbyList')}}>Back</button>
    </div>)

}

export default PlayerNameSection;
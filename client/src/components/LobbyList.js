import axios from "axios";
import { useEffect, useState } from "react";
import PlayerNameForm from "./PlayerNameForm";
import { captureRejectionSymbol } from "events";

export function LobbyList() {

    const [lobbyList, setLobbyList] = useState([]);
    const [enterName, setEnterName] = useState(false);
    const [gameIdToJoin, setGameIdToJoin] = useState('');

    useEffect(()=> {
        axios.get('http://localhost:4000/lobbyListSample')
        .then((res) => {
            console.log('got the lobby list: ', res.data);
            setLobbyList(res.data);
        })
        .catch((err) => {
            console.log('error getting lobby list: ', err.message);
        })
    }, [])

    function LobbyEntry(props) {
        return(<div>
            {props.name}
            <button onClick={()=> {
                console.log('button clicked. id is ' + props.gameId);
                setEnterName(true);
                setGameIdToJoin(props.gameId);
            }}>Join</button>
        </div>)
    }

    function LobbyEntryList() {
        console.log('rendering lobby list: ', lobbyList);
        const result = lobbyList.map((item) => {
            return <LobbyEntry key={item.gameId} name={item.name} gameId={item.gameId}/>
        });
        console.log('rendering' , result);
        return (result);
    }

    function handlePlayerNameSubmit(playerName) {
        console.log('player name subitted: ' + playerName);
        console.log('joining game id: ', gameIdToJoin);
        axios.post('http://localhost:4000/joinGame', {name: playerName, gameId: gameIdToJoin})
            .then((res) => {
                console.log('got a response from joinGame: ', res.data);
                if (res.data.success) {
                    
                } else {

                }
            })
            .catch((err) => {
                console.log('error joining game: ' , err.message);
            })
    }

    return (
        <center>
            <h1>Lobby List</h1>
            {enterName ? <PlayerNameForm handleSubmit={handlePlayerNameSubmit}/>
            : <LobbyEntryList/>}
            
        </center>
    );
}

export default LobbyList;
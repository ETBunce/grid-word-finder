import axios from "axios";
import { useEffect, useState } from "react";

function LobbyListSection(props) {

    
    const [lobbyList, setLobbyList] = useState([]);

    useEffect(()=> {
        axios.get('http://localhost:4000/lobbies')
        .then((res) => {
            console.log('got the lobby list: ', res.data);
            setLobbyList(res.data);
        })
        .catch((err) => {
            console.log('error getting lobby list: ', err.message);
        })
    }, [])

    function LobbyEntry(entryProps) {
        return(<div>
            {entryProps.name}
            <button onClick={()=> {
                console.log('button clicked. id is ' + props.options.gameId);
                props.goTo('PlayerName', {gameIdToJoin:entryProps.gameId, hostName: entryProps.name});
            }}>Join</button>
        </div>)
    }

    function LobbyEntryList() {
        const result = lobbyList.map((item) => {
            return <LobbyEntry key={item.gameId} name={item.name} gameId={item.gameId}/>
        });
        return (result);
    }

    return (
        <center>
            <h1>Lobby List</h1>
            <LobbyEntryList/>
            <button onClick={()=>{props.goTo('PlayerName', {newGame:true})}}>New Game</button>
        </center>
    );
}

export default LobbyListSection;
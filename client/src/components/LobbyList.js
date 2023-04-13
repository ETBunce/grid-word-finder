import axios from "axios";
import { useEffect, useState } from "react";

export function LobbyList() {

    const [lobbyList, setLobbyList] = useState([]);

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

    return (
        <center>
            <h1>Lobby List</h1>
            <LobbyEntryList/>
        </center>
    );
}

export default LobbyList;
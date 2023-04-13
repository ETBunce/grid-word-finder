import axios from "axios";
import { useEffect, useState } from "react";

export function LobbyList() {

    const [lobbyList, setLobbyList] = useState([]);

    useEffect(()=> {
        axios.get('http://localhost:4000/lobbyListSample')
        .then((res) => {
            console.log('got the lobby list: ', res.data);
        })
        .catch((err) => {
            console.log('error getting lobby list: ', err.message);
        })
    }, [])

    function LobbyEntry(props) {
        return(<div>
            {props.name}
            <button>Join</button>
        </div>)
    }

    function LobbyEntryList() {
        let list = [];
        for (let i = 0; i < lobbyList; i++) {
            list.push(<LobbyEntry name={lobbyList[i]} />);
        }
        return list;
    }

    return (
        <center>
            <h1>Lobby List</h1>
        </center>
    );
}

export default LobbyList;
import axios from "axios";
import { useEffect, useState } from "react";

function LobbyRoomSection (props) {

    const [players, setPlayers] = useState([]);
    const [listIntervalId, setListIntervalId] = useState();
    const [ready, setReady] = useState(false);

    function PlayerList() {
        let list = [];
        for (let i = 0; i < players.length; i++) {
            const text = players[i].name + ' ' + (players[i].ready ? '(Ready)' : '(Not Ready)');
            list.push(<div key={players[i].name}>{text}</div>)
        }
        return list;
    }

    
    useEffect(()=>{

        //Refresh the player list on an interval
        console.log('starting interval to check lobby players');
        if (listIntervalId) {
            console.log('clearing interval');
            clearInterval(listIntervalId);
        }
        const playerListInterval = setInterval(()=> {
            console.log('getting list'); 
            axios.get('http://localhost:4000/lobbyPlayers')
            .then((res) => {
                // console.log('got result from lobbyPlayers: ' , res.data);
                setPlayers(res.data);
            })
            .catch(err => console.log('error getting lobby players: ' , err));
        }, 500);
        setListIntervalId(playerListInterval);

    }, []);

    function toggleReady() {
        axios.post('http://localhost:4000/setReady', {ready: !ready})
        .then((res) => {
            console.log('got response from post to setReady: ', res.data);
            setReady(res.data.ready);
        })
        .catch(err => console.log('error posting to setReady: ', err.message));
    }

    return (
        <center>
            <h1>{props.options.hostName + "'s game"}</h1>
            <PlayerList/>
            <button onClick={toggleReady}>{ready ? 'Unready' : 'ready'}</button>
            <button onClick={()=>{clearInterval(listIntervalId); props.goTo('LobbyList');}}>Leave</button>
        </center>
    );
}

export default LobbyRoomSection;
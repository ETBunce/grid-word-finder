import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LobbyRoomSection (props) {

    const [players, setPlayers] = useState([]);
    const [listIntervalId, setListIntervalId] = useState();
    const [ready, setReady] = useState(false);
    const [countdown, setCountDown] = useState(-1);

    const navigate = useNavigate();

    function PlayerList() {
        let list = [];
        for (let i = 0; i < players.length; i++) {
            const text = players[i].name + ' ' + (players[i].ready ? '(Ready)' : '(Not Ready)');
            list.push(<div key={players[i].name}>{text}</div>)
        }
        return list;
    }

    //This is broken, needs to be fixed
    function BeginStartCountdown() {
        if (countdown > -1) return;
        let timer = 3;
        setCountDown(3);
        const intervalId = null;
        setInterval(()=> {
            console.log('counting down. timer:' , timer);
            setCountDown(timer);
            timer--;
            if (timer == 0) {
                clearInterval(intervalId);
                navigate('/game');
            }
        }, 1000);
    }
    
    useEffect(()=>{

        //Refresh the player list on an interval
        console.log('starting interval to check lobby players');
        if (listIntervalId) {
            console.log('clearing interval');
            clearInterval(listIntervalId);
        }
        const playerListInterval = setInterval(()=> {
            console.log('getting lobby state'); 
            axios.get('http://localhost:4000/lobbyState')
            .then((res) => {
                // console.log('got result from lobbyPlayers: ' , res.data);
                setPlayers(res.data.players);
                if (res.data.stage === 'Starting') {
                    clearInterval(listIntervalId);
                    BeginStartCountdown();
                }
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
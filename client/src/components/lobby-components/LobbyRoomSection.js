import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LobbyRoomSection (props) {

    const gameStartCountDownInterval = useRef(null);

    const [players, setPlayers] = useState([]);
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

    function BeginStartCountdown() {
        
        console.log('beginning countdown...');
        if (gameStartCountDownInterval.current) {
            console.log('cannot start the countdown, already counting down');
        }

        let thisCount = 4;

        gameStartCountDownInterval.current = setInterval(()=> {
            setCountDown(--thisCount);
            // console.log('this count is', thisCount);
            if (thisCount == 0) {
                navigate('/game');
            }

        }, 1000)

    }

    
    useEffect(()=>{

        //Refresh the player list on an interval
        const playerListInterval = setInterval(()=> {
            // console.log('getting lobby state'); 
            axios.get('http://localhost:4000/lobbyState')
            .then((res) => {
                // console.log('got result from lobbyPlayers: ' , res.data);
                setPlayers(res.data.players);
                if (res.data.stage === 'Starting') {
                    clearInterval(playerListInterval);
                    BeginStartCountdown();
                }
            })
            .catch(err => console.log('error getting lobby players: ' , err));
        }, 500);

        return(()=> {
            clearInterval(playerListInterval);
            if (gameStartCountDownInterval.current) {
                // console.log('clearing game start count down interval');
                clearInterval(gameStartCountDownInterval.current);
            }
        });
    }, []);

    function toggleReady() {
        axios.post('http://localhost:4000/setReady', {ready: !ready})
        .then((res) => {
            // console.log('got response from post to setReady: ', res.data);
            setReady(res.data.ready);
        })
        .catch(err => console.log('error posting to setReady: ', err.message));
    }

    return (
        <center>
            <h1>{props.options.hostName + "'s game"}</h1>
            <PlayerList/>
            {countdown > 0 ? 
                <div>
                    Game starting in: {countdown}
                </div>
                : <div>
                    <button onClick={toggleReady}>{ready ? 'Unready' : 'ready'}</button>
                    <button onClick={()=>{ props.goTo('LobbyList');}}>Leave</button>
                </div>}
        </center>
    );
}

export default LobbyRoomSection;
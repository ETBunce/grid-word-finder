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
            const classNameText = 'form-control mx-auto ' + (players[i].ready ? 'is-valid' : 'is-invalid');
            const classNameLabel = 'input-group-text text-center text-break text-white ' + (players[i].ready ? 'bg-success' : 'bg-danger')
            list.push(
                <div className={"input-group mb-3 mx-auto"} key={players[i].name}>
                    <input type={'text'} className={classNameText} value={players[i].name} style={{backgroundColor: "white"}} readOnly/>
                    <div className={'input-group-append'}>
                        <span className={classNameLabel} style={{minWidth: "110px"}}>{players[i].ready ? 'Ready' : 'Not Ready'}</span>
                    </div>
                </div>
            )
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
            if (thisCount === 0) {
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
            <h1 className={"text-capitalize"}>{props.options.hostName + "'s game"}</h1>
            <div className={'card'}>
                <div className={'card-body bg-light'}>
                    <div className={"row"}>
                        <div className={"col-md-7 mx-auto"}>
                            <PlayerList/>
                        </div>
                    </div>
                    {countdown > 0 ?
                        <h5>
                            Game starting in: {countdown}
                        </h5>
                        : <div className={"btn-group"}>
                            <button className={ready ? "btn btn-danger" : "btn btn-success"} onClick={toggleReady}>{ready ? 'Unready' : 'ready'}</button>
                            <button className={"btn btn-warning"} onClick={()=>{

                                axios.post('http://localhost:4000/leaveGame')
                                    .then((res)=> {
                                        console.log('left the game');
                                    })
                                    .catch(err => console.log('error leaving game'));

                                props.goTo('LobbyList');

                            }}>Leave</button>
                        </div>}
                </div>
            </div>
        </center>
    );
}

export default LobbyRoomSection;
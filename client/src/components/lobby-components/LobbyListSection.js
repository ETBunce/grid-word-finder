import axios from "axios";
import { useEffect, useState } from "react";

function LobbyListSection(props) {

    
    const [lobbyList, setLobbyList] = useState([]);

    useEffect(()=> {
        const lobbyListInterval = setInterval(() => {
            axios.get('http://localhost:4000/lobbies')
            .then((res) => {
                // console.log('got the lobby list: ', res.data);
                setLobbyList(res.data);
            })
            .catch((err) => {
                console.log('error getting lobby list: ', err.message);
            })
        }, 500);

        return(()=>{
            clearInterval(lobbyListInterval);
        });
    }, [])

    function LobbyEntry(entryProps) {
        return(
            <div className={'container-fluid'}>
                <div className={'row'}>
                    <div className={'col-md-8 mx-auto'}>
                        <div className={'input-group mb-3'}>
                            <div className={"input-group-prepend mx-auto"}>
                                <input type="text" className="form-control" placeholder={entryProps.name} disabled={true} value={entryProps.name} />
                                <button type={'button'} className={'btn btn-info'} onClick={()=> {
                                    console.log('button clicked. id is ' + props.options.gameId);
                                    props.goTo('PlayerName', {gameIdToJoin:entryProps.gameId, hostName: entryProps.name});
                                }}>JOIN</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

    function LobbyEntryList() {
        const result = lobbyList.map((item) => {
            return <LobbyEntry key={item.gameId} name={item.name} gameId={item.gameId}/>
        });
        return (
            <>
                {lobbyList.length > 0 ? result : <p>No one else is hosting a game! Host one yourself by clicking on "Host New Game"</p>}
            </>
        );
    }

    return (
        <center>
            <h1>Lobby List</h1>
            <p>Join an existing game or host your own</p>
            <div className={'card'}>
                <div className={'card-body bg-light'}>
                    <div className={'card-title'}><h4>Existing Games</h4></div>
                    <br />
                    <LobbyEntryList/>
                </div>

            </div>
            <br/>
            <button type={'button'} className={'btn btn-success'} onClick={()=>{props.goTo('PlayerName', {newGame:true})}}>Host New Game</button>
        </center>
    );
}

export default LobbyListSection;
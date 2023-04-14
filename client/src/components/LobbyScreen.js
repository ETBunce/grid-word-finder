import { useState } from "react"
import LobbyListSection from './lobby-components/LobbyListSection'
import PlayerNameSection from './lobby-components/PlayerNameSection';
import LobbyRoomSection from './lobby-components/LobbyRoomSection';

function LobbyScreen() {

    const [section, setSection] = useState('LobbyList');
    const [options, setOptions] = useState({});

    function goTo(newSection, options) {
        if (options == null) {
            options = {};
        }
        setOptions(options);
        setSection(newSection);
    }



    function getSectionComponent() {
        switch(section) {
            case 'LobbyList': return <LobbyListSection goTo={goTo} options={options}/>;
            case 'PlayerName': return <PlayerNameSection goTo={goTo} options={options}/>;
            case 'LobbyRoom': return <LobbyRoomSection goTo={goTo} options={options}/>
        }
    }

    return (<div>
        {getSectionComponent()}
    </div>)

}

export default LobbyScreen
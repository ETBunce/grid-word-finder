import { useEffect, useState } from "react";

export function PlayerNameForm(props) {

    const [value, setValue] = useState('');
    
    const handleSubmit = (event) => {
        console.log('submitting');
        event.preventDefault();
        props.handleSubmit(value);
    }

    
    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (<form onSubmit={handleSubmit}>
        <label>
            Enter your name:
            <input type="text" value={value} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
    </form>);
}

export default PlayerNameForm;
import { useEffect, useState } from "react";

export function PlayerNameForm() {

    
    
    const handleSubmit = (event) => {

    }

    
    const handleChange = (event) => {

    }

    render() {
        return (<form onSubmit={handleSubmit}>
            <label>
                Guess a letter:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>);
    }
}

export default PlayerNameForm;
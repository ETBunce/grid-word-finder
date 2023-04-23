import { useEffect, useState } from "react";

export function PlayerNameForm(props) {

    const [value, setValue] = useState('');

    const maxNameLength = 20
    
    const handleSubmit = (event) => {
        if (document.getElementById("submit-btn").disabled) {
            console.log("Cannot submit invalid name!")
        } else {
            console.log('submitting');
            event.preventDefault();
            props.handleSubmit(value.trim());
        }
    }

    
    const handleChange = (event) => {
        event.target.value = event.target.value.trimStart();
        const submittedName = event.target.value;
        if (/[^0-9a-zA-Z_ ]/.test(submittedName)) {
            document.getElementById("invalid-feedback").innerHTML = "Name may only contain alpha-numeric characters, spaces, or underscores.";
            document.getElementById("name-field").className = "form-control is-invalid";
            document.getElementById("submit-btn").disabled = true;
        }else if (submittedName.length > 0 && submittedName.length <= maxNameLength) {
            document.getElementById("invalid-feedback").innerHTML = "Please fill out this field.";
            document.getElementById("name-field").className = "form-control";
            document.getElementById("submit-btn").disabled = false;
        } else if (submittedName.length > maxNameLength) {
            document.getElementById("invalid-feedback").innerHTML = "Name is too long! Please use a shorter name.";
            document.getElementById("name-field").className = "form-control is-invalid";
            document.getElementById("submit-btn").disabled = true;
        } else {
            document.getElementById("invalid-feedback").innerHTML = "Please fill out this field.";
            document.getElementById("name-field").className = "form-control is-invalid";
            document.getElementById("submit-btn").disabled = true;
        }
        setValue(submittedName);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={'row'}>
                <div className={'col-md-8 mx-auto'}>
                    <div className={'input-group mb-3 mx-auto'}>
                        <div className={'input-group-prepend'}>
                            <span className="input-group-text">Your name</span>
                        </div>
                        <input id={"name-field"} onChange={handleChange} type="text" className="form-control" placeholder="wordSlayer5000" required={true}/>
                        <div className="input-group-append">
                            <button id={"submit-btn"} type={'submit'} className={'btn btn-success'}>Submit</button>
                        </div>
                        <div className="valid-feedback">Name is valid! Redirecting to game lobby...</div>
                        <div id={"invalid-feedback"} className="invalid-feedback">Please fill out this field.</div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PlayerNameForm;
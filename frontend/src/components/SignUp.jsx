import App from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from "../utils";
import * as utilsErrorHandling from "../utils_errorHandling";
import * as utilsInputValidation from '../utils_inputValidation';

function SignUp() {

    const navigate = useNavigate();
    const roleRequired = null;


    //-------------------------------------------------------
    //Inputs
    //-------------------------------------------------------

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleNameChange(event) {
        let input = event.target.value;
        setName(input);
    }

    function handleEmailChange(event) {
        let input = event.target.value;
        setEmail(input);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------


    async function handleSignUpSubmit(e) {
        e.preventDefault();

        // const data = [
        //     { name, trim: 1, required: 1 },
        //     { email, trim: 1, required: 1 },
        //     { password, trim: 0, required: 1 },
        // ];

        const data = [
            { key: "name", value: name, type: "string", trim: 1, required: 1 },
            { key: "email", value: email, type: "email", trim: 1, required: 1 },
            { key: "password", value: password, type: "password", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------------

        alert("All Checks Passed, Forwarding Request...");
        return axios.post(App.baseUrl + "/signUp", transformedData)
            .then(res => handleSignUpSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err));


    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSignUpSuccess(res) {
        const { message } = res.data;
        alert(message);
        window.location.reload();
    }


    return (
        <>
            <NavBar></NavBar>
            <UserBar role={roleRequired}></UserBar>


            <h1>Sign Up </h1>

            <form>
                <div>
                    <label htmlFor='1'>Name</label>
                    <input id='1' type='text' value={name} onChange={handleNameChange}></input>
                </div>

                <div>
                    <label htmlFor='2'>Email</label>
                    <input id='2' type='text' value={email} onChange={handleEmailChange}></input>
                </div>

                <div>
                    <label htmlFor='3'> Password </label>
                    <input id='3' type='password' value={password} onChange={handlePasswordChange}></input>
                </div>


                <button type="submit" onClick={handleSignUpSubmit}>Submit</button>
            </form>

        </>
    );
}

export default SignUp;
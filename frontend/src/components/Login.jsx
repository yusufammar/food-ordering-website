import App from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import * as utils from "../utils";

function Login() {

    //-------------------------------------------------------
    //User
    //-------------------------------------------------------

    const [user, setUser] = useState({});

    useEffect(displayUser, []);

    function displayUser() {
        const savedUser = utils.getSavedUser();
        setUser(savedUser);
    }

    //-------------------------------------------------------
    //Inputs
    //-------------------------------------------------------

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    function handleLoginSubmit(e) {
        e.preventDefault();

        const data = [
            { email, trim: 1, required: 1 },
            { password, trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = utils.validateData(data);

        if (dataValid) {
            alert("All Checks Passed, Forwarding Request...");
            //--------------------------------------------------
            return axios.post(App.baseUrl + "/login", transformedData)
                .then(res => handleLoginSuccess(res))
                .catch(err => handleLoginFailure(err));
        }
        else {
            alert(errMessage);
        }

    }


    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleLoginSuccess(res) {
        const { token, message } = res.data;
        utils.setUser(token);

        alert(message);
        window.location.reload();
    }

    function handleLoginFailure(err) {
        utils.unsetUser();
        setUser({});

        const error = err.response.data.error;
        alert(error);
    }

    return (
        <>
            <Link className='linkButton' to="/">Home</Link>

            <div>
                <h4>User ID: {user.id} | Name: {user.name} | Email: {user.email} | Role: {user.role} </h4>
                Token: {user.token}
            </div>

            <h1>Login </h1>
            <form>
                <div>
                    <label htmlFor='1'>Email</label>
                    <input id='1' type='text' value={email} onChange={handleEmailChange}></input>
                </div>

                <div>
                    <label htmlFor='2'> Password </label>
                    <input id='2' type='password' value={password} onChange={handlePasswordChange}></input>
                </div>


                <button type="submit" onClick={handleLoginSubmit}>Submit</button>
            </form>

        </>
    );
}

export default Login;

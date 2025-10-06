import App from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { data, Link, useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from "../utils";
import * as utilsErrorHandling from '../utils_errorHandling';
import * as utilsInputValidation from '../utils_inputValidation';
import '../styles/login-signup.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LoginIcon from '@mui/icons-material/Login';


function Login() {

    const navigate = useNavigate();
    const roleRequired = null;

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

    async function handleLoginSubmit(e) {
        e.preventDefault();


        const data = [
            { key: "email", value: email, type: "email", trim: 1, required: 1 },
            { key: "password", value: password, type: "password", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }

        //##########################
        //Test (Backend Response- HandleDataInvalid): Passing Incomplete Data to Backend
        const dataIncomplete = { password };
        //##############################

        //---------------------------------------------------------------
        alert("All Checks Passed, Forwarding Request...");
        // console.log(App.baseUrl + "/login");
        return axios.post(App.baseUrl + "/login", transformedData)
            .then(res => handleLoginSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleLoginSuccess(res) {
        const { token, message } = res.data;
        utils.setUser(token);

        alert(message);
        navigate("/");

    }



    return (
        <div className='pageDiv2'>
            <NavBar role={roleRequired} />

            <div className='formContainer'>


                <div className='formCard'>

                    {/* <div className='formDiv'> */}

                    <form className='form'>

                        <div className='cardTitle'>
                            <LoginIcon sx={{ fontSize: 40, color: 'blue' }} />
                            <h1>Login</h1>

                        </div>

                        <TextField label="Email" type='text' value={email} onChange={handleEmailChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <EmailIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />


                        <TextField label="Password" type='password' value={password} onChange={handlePasswordChange}  // required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <LockOpenIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <div className='formButtons'>
                            <button type="submit" onClick={handleLoginSubmit}>Login</button>

                            <button className='secondaryButton' onClick={() => navigate("/signUp")}>Sign Up</button>

                        </div>

                    </form>
                    {/* </div> */}

                </div>

            </div>

        </div>
    );
}

export default Login;

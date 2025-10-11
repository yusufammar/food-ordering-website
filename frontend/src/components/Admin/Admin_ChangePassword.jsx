import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

import '../../styles/login-signup.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import LockOpenIcon from '@mui/icons-material/LockOpen';


function AdminChangePassword() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");

    function handleOldPassChange(event) {
        setOldPass(event.target.value);
    }    
    function handleNewPassChange(event) {
        setNewPass(event.target.value);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    async function handleRequest(e) {
        e.preventDefault();

        const data = [
            { key: "oldPass", value: oldPass, type: "password", trim: 0, required: 1 },
            { key: "newPass", value: newPass, type: "password", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------
        const config = { headers: { authorization: user.token } };

        return axios.post(App.baseUrl + "/admin/changeAdminPassword", transformedData, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSuccess(res) {
        utilsErrorHandling.handleSuccessStandard(res);
        navigate("/"); 

    }

    return (
        <>
            <NavBar role={roleRequired} />

            <h1>Admin - Change Password</h1>

            
            <br/>
            <form className='form'>


                <TextField label="Old Password" type='password' value={oldPass} onChange={handleOldPassChange}// required  id="outlined" defaultValue="Hello World"
                    slotProps={{
                        input: { startAdornment: (<InputAdornment position="start">  <LockOpenIcon /> </InputAdornment>) }
                    }}
                    sx={{
                        width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                    }} />
                
                <TextField label="New Password" type='password' value={newPass} onChange={handleNewPassChange}// required  id="outlined" defaultValue="Hello World"
                    slotProps={{
                        input: { startAdornment: (<InputAdornment position="start"> <LockOpenIcon /> </InputAdornment>) }
                    }}
                    sx={{
                        width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                    }} />

                <button type="submit" onClick={handleRequest}>Submit</button>

            </form>

        </>

    );
}

export default AdminChangePassword;
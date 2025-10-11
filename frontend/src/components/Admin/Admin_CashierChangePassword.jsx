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


function AdminChangeCashierPassword() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [adminPass, setAdminPass] = useState("");
    const [newCashierPass, setNewCashierPass] = useState("");

    function handleAdminPassChange(event) {
        setAdminPass(event.target.value);
    }    
    function handleNewCashierPassChange(event) {
        setNewCashierPass(event.target.value);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    async function handleRequest(e) {
        e.preventDefault();

        const data = [
            { key: "adminPass", value: adminPass, type: "password", trim: 0, required: 1 },
            { key: "newCashierPass", value: newCashierPass, type: "password", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------
        const config = { headers: { authorization: user.token } };

        return axios.post(App.baseUrl + "/admin/changeCashierPassword", transformedData, config)
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

            <h1>Admin - Change Cashier Password</h1>

            
            <br/>
            <form className='form'>


                <TextField label="Admin Password" type='password' value={adminPass} onChange={handleAdminPassChange}// required  id="outlined" defaultValue="Hello World"
                    slotProps={{
                        input: { startAdornment: (<InputAdornment position="start">  <LockOpenIcon /> </InputAdornment>) }
                    }}
                    sx={{
                        width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                    }} />
                
                <TextField label="Cashier New Password" type='password' value={newCashierPass} onChange={handleNewCashierPassChange}// required  id="outlined" defaultValue="Hello World"
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

export default AdminChangeCashierPassword;
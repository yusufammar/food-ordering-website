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

import LoginIcon from '@mui/icons-material/Login';
import StoreIcon from '@mui/icons-material/Store';


function AdminSetDeliveryFee() {
    const navigate = useNavigate();
    const roleRequired = "admin";
    const user = utils.getSavedUser();

    //---------------------------------------
    const [deliveryFee, setDeliveryFee] = useState("");

    function handleDeliveryFeeChange(event) {
        setDeliveryFee(event.target.value);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    async function handleRequest(e) {
        e.preventDefault();

        const data = [
            { key: "deliveryFee", value: deliveryFee, type: "number", trim: 1, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------
        const config = { headers: { authorization: user.token } };

        return axios.post(App.baseUrl + "/admin/setDeliveryFee", transformedData, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSuccess(res){
        utilsErrorHandling.handleSuccessStandard(res);
        navigate("/");  // need to refresh manually after that, for change to reflect
       
    }

    return (
        <>
            <NavBar role={roleRequired} />

            <h1>Admin - Set Delivery Fee</h1>


            <form className='form'>


                <TextField label="Delivery Fee" type='number' value={deliveryFee} onChange={handleDeliveryFeeChange}// required  id="outlined" defaultValue="Hello World"
                    slotProps={{
                        input: { startAdornment: (<InputAdornment position="start"> <StoreIcon /> </InputAdornment>) }
                    }}
                    sx={{
                        width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                    }} />

                <button type="submit" onClick={handleRequest}>Submit</button>

            </form>

        </>

    );
}

export default AdminSetDeliveryFee;
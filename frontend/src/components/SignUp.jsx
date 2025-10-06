import App from '../App';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from "../utils";
import * as utilsErrorHandling from "../utils_errorHandling";
import * as utilsInputValidation from '../utils_inputValidation';

import "../styles/login-signup.css";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import ForestIcon from '@mui/icons-material/Forest';
import ApartmentIcon from '@mui/icons-material/Apartment';
import FlagIcon from '@mui/icons-material/Flag';
import SignpostIcon from '@mui/icons-material/Signpost';
import WbIridescentIcon from '@mui/icons-material/WbIridescent';

function SignUp() {

    const navigate = useNavigate();
    const roleRequired = null;


    //-------------------------------------------------------
    //Inputs
    //-------------------------------------------------------

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Address
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [district, setDistrict] = useState("");
    const [buildingNo, setBuildingNo] = useState("");
    const [apartmentNo, setApartmentNo] = useState("");
    const [addressDescription, setAddressDescription] = useState("");



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

    function handleCityChange(event) {
        setCity(event.target.value);
    }
    function handleDistrictChange(event) {
        setDistrict(event.target.value);
    }
    function handleStreetChange(event) {
        setStreet(event.target.value);
    }
    function handleBuildingNoChange(event) {
        setBuildingNo(event.target.value);
    }
    function handleApartmentNoChange(event) {
        setApartmentNo(event.target.value);
    }
    function handleAddressDescriptionChange(event) {
        setAddressDescription(event.target.value);
    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------


    async function handleSignUpSubmit(e) {
        e.preventDefault();

        const data = [
            { key: "name", value: name, type: "string", trim: 1, required: 1 },
            { key: "email", value: email, type: "email", trim: 1, required: 1 },
            { key: "password", value: password, type: "password", trim: 0, required: 1 },

            { key: "city", value: city, type: "string", trim: 1, required: 1 },
            { key: "district", value: district, type: "string", trim: 1, required: 1 },
            { key: "street", value: street, type: "string", trim: 1, required: 1 },
            { key: "buildingNo", value: buildingNo, type: "number", trim: 1, required: 1 },
            { key: "apartmentNo", value: apartmentNo, type: "number", trim: 1, required: 1 },
            { key: "addressDescription", value: addressDescription, type: "string", trim: 1, required: 0 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------------

        alert("All Checks Passed, Forwarding Request...");
        return axios.post(App.baseUrl + "/signUp", transformedData)
            .then(res => handleSignUpSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));


    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    function handleSignUpSuccess(res) {
        const { message } = res.data;
        alert(message);
        // window.location.reload();
        navigate("/login");
    }


    return (
        <div className='pageDiv2'>
            <NavBar role={roleRequired} />

            <div className='signUpFormContainer'>

                <div className='formCard'>


                    <form className='form'>

                        <div className='cardTitle'>
                            <AssignmentIcon sx={{ fontSize: 40, color: 'blue' }} />
                            <h1>Sign Up</h1>

                        </div>


                        <TextField required label="Name" type='text' value={name} onChange={handleNameChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <PersonIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <TextField required label="Email" type='text' value={email} onChange={handleEmailChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <EmailIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />


                        <TextField required label="Password" type='password' value={password} onChange={handlePasswordChange}  // required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <LockOpenIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />


                        <div className='cardTitle'>
                            <HomeIcon sx={{ fontSize: 30, color: 'blue' }} />
                            <h3>Address Details</h3>
                        </div>


                        <TextField required label="City" type='text' value={city} onChange={handleCityChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <ForestIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <TextField required label="District" type='text' value={district} onChange={handleDistrictChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <FlagIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />


                        <TextField required label="Street / Compound" type='text' value={street} onChange={handleStreetChange} // required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <SignpostIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <TextField required label="Building No / Parcel No" type='number' value={buildingNo} onChange={handleBuildingNoChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <ApartmentIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <TextField required label="Apartment No / Villa No" type='number' value={apartmentNo} onChange={handleApartmentNoChange}// required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <HomeIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />


                        <TextField label="Description" type='text' value={addressDescription} onChange={handleAddressDescriptionChange} // required  id="outlined" defaultValue="Hello World"
                            slotProps={{
                                input: { startAdornment: (<InputAdornment position="start"> <WbIridescentIcon /> </InputAdornment>) }
                            }}
                            sx={{
                                width: "300px", fontSize: 20, '& .MuiOutlinedInput-root': { borderRadius: 50 }, '& .MuiInputLabel-root': { fontSize: 20 }
                            }} />

                        <div className='formButtons'>
                            <button type="submit" onClick={handleSignUpSubmit}>Sign Up</button>
                            <button className='secondaryButton' onClick={() => navigate("/login")}>Login</button>
                        </div>
                    </form>
                    {/* </div> */}

                </div>

            </div>

        </div>
    );
}

export default SignUp;
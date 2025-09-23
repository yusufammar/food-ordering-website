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
            .catch(err => utilsErrorHandling.handleFailureStandard(err,navigate));


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




                <h3>Address Details</h3>

                <div>
                    <label htmlFor='4'>City</label>
                    <input id='4' type='text' value={city} onChange={handleCityChange}></input>
                </div>
                <div>
                    <label htmlFor='5'>District</label>
                    <input id='5' type='text' value={district} onChange={handleDistrictChange}></input>
                </div>
                <div>
                    <label htmlFor='6'>Street</label>
                    <input id='6' type='text' value={street} onChange={handleStreetChange}></input>
                </div>
                <div>
                    <label htmlFor='7'>Building No</label>
                    <input id='7' type='number' value={buildingNo} onChange={handleBuildingNoChange}></input>
                </div>
                <div>
                    <label htmlFor='8'>Apartment No</label>
                    <input id='8' type='number' value={apartmentNo} onChange={handleApartmentNoChange}></input>
                </div>
                <div>
                    <label htmlFor='9'>Description</label>
                    <input id='9' type='text' value={addressDescription} onChange={handleAddressDescriptionChange}></input>
                </div>


                <button type="submit" onClick={handleSignUpSubmit}>Submit</button>
            </form>

        </>
    );
}

export default SignUp;
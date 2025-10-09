import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CustomerProfile() {
    const navigate = useNavigate();
    const location = useLocation();

    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [profile, setProfile] = useState({});
    const [address, setAddress] = useState({});

    useEffect(getProfileRequest, []);
    // useEffect(updateProfile_Address, [profile,address]);


    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getProfileRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + `/user/getProfile`, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        // console.log(res.data);
        setProfile(res.data.profile);
        setAddress(res.data.profileAddress);
    }

    function updateProfile_Address() {
        console.log("Profile: ");
        console.log(profile);
        console.log("--------------");
        console.log("Address: ");
        console.log(address);
        console.log("--------------");
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <>
           <NavBar role={roleRequired}/>

            <h1>My Profile</h1>


            <p>  <b>Name:</b> {profile.name} | <b>Email:</b> {profile.email} | <b>Phone No:</b> {profile.phone_no} </p>


            <h2>Address</h2>
            <p> <b>City:</b> {address.city} | <b>District:</b> {address.district} | <b>Street:</b> {address.street} | <b>Building No:</b> {address.building_no} | <b>Apartment No:</b> {address.apt_no} </p>
            <p> <b>Description:</b> {address.desscription}</p>

           




        </>

    );
}

export default CustomerProfile;
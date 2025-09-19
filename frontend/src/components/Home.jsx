import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';

function Home() {

    const navigate = useNavigate();
    const roleRequired = null;
    const user = utils.getSavedUser();

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    function handleSampleRequest() { // only for checking token middleware functionality


        const config = { headers: { authorization: user.token } };

        return axios.get(App.baseUrl + "/user/sampleRequest", config)
            .then(res => utilsErrorHandling.handleSuccessStandard(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err));

        //---------------
        //Test
        // const data={};

        // return axios.post(App.baseUrl + "/admin/importProducts", data,  config)
        //     .then(res => handleSuccess(res))
        //     .catch(err => handleFailure(err));
    }

    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------



    return (
        <>

            <NavBar></NavBar>
            <UserBar role={roleRequired}></UserBar>

            <h1>Home </h1>

            <button onClick={handleSampleRequest}> Sample Request</button>

        </>

    );
}

export default Home;
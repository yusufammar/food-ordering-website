import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import * as utils from '../utils';
import NavBar from './NavBar';
import UserBar from './UserBar';

function Home() {

    const navigate = useNavigate();
    const roleRequired= null;
    const user = utils.getSavedUser();

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    function handleSampleRequest(e) { // only for checking token middleware functionality

        //Input Validation
        if (!user.token){
            return alert("No User Logged In - No Token")
        }

        //------------------------------------------
        
        const config = {
            headers: {
                authorization: user.token
            }
        }

        return axios.get(App.baseUrl + "/user/sampleRequest", config)
            .then(res => handleSuccess(res))
            .catch(err => handleFailure(err));

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

    function handleSuccess(res) {
        const { message } = res.data;
        alert(message);
    }


    function handleFailure(err) {
        const error = err.response.data.error;
        alert(error);
        utils.unsetUser();
        window.location.reload();
        // setUser({});
    }


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
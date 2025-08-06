import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as utils from '../utils';

function Home() {

    const [user, setUser] = useState({});

    useEffect(displayUser, []);

    function displayUser() {
        const savedUser = utils.getSavedUser();
        setUser(savedUser);
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

    function handleClick(e) {

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
            <div className='nav-bar'>
                <Link className='linkButton' to="/login">Login</Link>
                <Link className='linkButton' to="/signUp">Sign Up</Link>
            </div>


            <div>
                <h4>User ID: {user.id} | Name: {user.name} | Email: {user.email} </h4>
                Token: {user.token}
            </div>

            <h1>Home </h1>

            <button onClick={handleClick}> Sample Request</button>

        </>

    );
}

export default Home;
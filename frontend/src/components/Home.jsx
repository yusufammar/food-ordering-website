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

        </>

    );
}

export default Home;
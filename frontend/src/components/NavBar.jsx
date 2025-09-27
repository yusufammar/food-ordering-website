import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';

function NavBar() {

    const navigate = useNavigate();
  

    return (

        <div className='nav-bar'>
            <Link className='linkButton' to="/">Home</Link>
            <Link className='linkButton' to="/login">Login</Link>
            <Link className='linkButton' to="/signUp">Sign Up</Link>
            <Link className='linkButton' to="/customerHome">Customer Home</Link>
            <Link className='linkButton' to="/customerOrderHistory">My Orders</Link>
            <Link className='linkButton' to="/customerProfile">My Profile</Link>
            <Link className='linkButton' to="/adminHome">Admin Home</Link>
            <button className="redButton" onClick={()=>utilsErrorHandling.logout(navigate)}>Log Out</button>
        </div>



    );
}

export default NavBar;
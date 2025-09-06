import App from '../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as utils from '../utils';
import NavBar from './NavBar';
import UserBar from './UserBar';

function AdminHome() {
    const navigate = useNavigate();
    const roleRequired= "admin";

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------

     


    return (
        <>
           <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Admin Home</h1>     

            <Link className='linkButton' to="/adminImportProducts">Import Products</Link>     

        </>

    );
}

export default AdminHome;
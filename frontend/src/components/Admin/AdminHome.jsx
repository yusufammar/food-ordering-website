import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';

function AdminHome() {
    const navigate = useNavigate();
    const roleRequired = "admin";

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  


    return (
        <>
          <NavBar role={roleRequired}/>

            <h1>Admin Home</h1>

            <Link className='linkButton' to="/adminImportProducts">Import Products</Link>

            <br></br>
            <Link className='linkButton' to="/adminUploadItemsImages">Upload Items Images</Link>

            <br></br>
            <Link className='linkButton' to="/adminSetStoreName">Set Store Name</Link>


        </>

    );
}

export default AdminHome;
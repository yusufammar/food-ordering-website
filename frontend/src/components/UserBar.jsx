import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import * as utils from '../utils';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

function UserBar({ role }) {
    console.log("role passed (needed): " + role);
    //-------------------------------------------------

    const navigate = useNavigate();

    //------------------------------------------------------

    const [user, setUser] = useState({});
    const currentUser = utils.getSavedUser();

    useEffect(displayUser, []);
    useEffect(checkRole, []);

    //------------------------------------------------

    function displayUser() {
        setUser(currentUser);
    }

    function checkRole() {
        if (role == null)
            return

        if (currentUser.role != role) {
            const errMsg = "" + role + " Login Required";
            alert("Access Denied: " + errMsg);
            navigate("/");
        }
    }


    return (

        <div>

            <div className='userDiv'>
                <PersonIcon  sx={{ color: 'blue'}}/><a> {user.name} </a>
            </div>

             <div className='userDiv'>
                <EmailIcon  sx={{ color: 'blue'}}/><a> {user.email} </a>
            </div>

            {/* <h4>User ID: {user.id} | Name: {user.name} | Email: {user.email} | Role: {user.role} </h4> */}
            {/* Token: {user.token} */}
        </div>

    );
}

export default UserBar;
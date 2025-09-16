import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import * as utils from '../utils';

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
            const errMsg = "" + role + " Login Required"
            alert("Access Denied: " + errMsg);
            navigate("/");
        }
    }


    return (

        <div>
            <h4>User ID: {user.id} | Name: {user.name} | Email: {user.email} | Role: {user.role} </h4>
            Token: {user.token}
        </div>

    );
}

export default UserBar;
import App from '../App';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';
import CustomerHome from './Customer/CustomerHome';
import AdminHome from './Admin/AdminHome';
import CashierOrders from './Cashier/Cashier_Orders';

function Home() {

    const navigate = useNavigate();
    const roleRequired = null;
    const user = utils.getSavedUser();

    useEffect(handleNoUser, [user]);

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------


    function handleNoUser() {
        if (!user.role)
            navigate("/login");
    }


    //-------------------------------------------------------
    //Helper Methods
    //-------------------------------------------------------

    return (
        <>
            {(user.role == "customer") && <CustomerHome />}
            {(user.role == "admin") && <AdminHome />}
            {(user.role == "cashier") && <CashierOrders />}
        </>

    );
}

export default Home;
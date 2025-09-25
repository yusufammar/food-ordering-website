import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CustomerOrderHistory() {
    const navigate = useNavigate();
    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [orders, setOrders] = useState([]);


    useEffect(getOrdersRequest, []);
    // useEffect(updateOrders, [orders]);

    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getOrdersRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + "/user/getOrders", config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        setOrders(res.data.orders);
    }

    // function updateOrders() {
    //     console.log("Orders: ");
    //     console.log(orders);
    //     console.log("--------------");
    // }

    function viewOrderItems(value, index) {
        const data = { state: { order: value } };
        navigate('/customerOrderDetails', data); // data passed to next page
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  

    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Customer Order History</h1>


            {orders.map((value, index) =>
                <p key={index}> Date: {value.date} | Time: {value.time} | Total: {value.total} EGP | Payment Method: {value.payment_method} | Status: {value.status} |
                    <button onClick={() => viewOrderItems(value, index)}> Details </button>
                </p>

            )}

        </>

    );
}

export default CustomerOrderHistory;
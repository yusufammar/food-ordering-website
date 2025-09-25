import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CustomerOrderDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const roleRequired = "customer";
    const user = utils.getSavedUser();
    const order = location.state?.order; // retrieve passed state
    const [orderItems, setOrderItems] = useState([]);


    useEffect(getOrderItemsRequest, []);
    // useEffect(updateOrderItems, [orderItems]);


    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getOrderItemsRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + `/user/getOrderItems/${order.id}`, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        setOrderItems(res.data.orderItems);
    }

    function updateOrderItems() {
        console.log("Order Items: ");
        console.log(orderItems);
        console.log("--------------");
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Order Details</h1>
            
            <p> Date: {order.date} | Time: {order.time} | Total: {order.total} EGP | Payment Method: {order.payment_method}  </p>
            <p>Status: {order.status}</p>


            <h3>Items List</h3>
            {orderItems.map((value, index) =>
                <p key={index}> Name: {value.name} | Price: {value.price} | Quantity: {value.quantity}  </p>
                
            )}




        </>

    );
}

export default CustomerOrderDetails;
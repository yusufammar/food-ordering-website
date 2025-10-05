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
          <NavBar role={roleRequired}/>

            <h1>Order Details</h1>
            
            <p> <b>Date:</b> {order.date} | <b>Time:</b> {order.time} | <b>Total:</b> {order.total} EGP | <b>Payment Method:</b> {order.payment_method}  </p>
            <p> <b>Status:</b> {order.status}</p>

            <br></br>
            <h2>Items List</h2>
            {orderItems.map((value, index) =>
                <p key={index}> <b>Name:</b> {value.name} | <b>Price:</b> {value.price} | <b>Quantity:</b> {value.quantity}  </p>
                
            )}




        </>

    );
}

export default CustomerOrderDetails;
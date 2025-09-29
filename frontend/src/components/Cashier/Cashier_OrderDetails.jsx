import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CashierOrderDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const roleRequired = "cashier";
    const user = utils.getSavedUser();
    const order = location.state?.order; // retrieve passed state
    const [orderItems, setOrderItems] = useState([]);
    const [customerAddress, setCustomerAddress] = useState({});


    useEffect(getOrderDetailsRequest, []);
    // useEffect(display, [orderItems, customerAddress]);


    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getOrderDetailsRequest() {
        const config = { headers: { authorization: user.token } };
        const customerID = order.user_id;


        axios.get(App.baseUrl + `/cashier/getOrderDetails/${order.id}/${customerID}`, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        setOrderItems(res.data.orderItems);
        setCustomerAddress(res.data.customerAddress);
    }

    function display() {
        console.log("Order Items: ");
        console.log(orderItems);
        console.log("--------------");
        console.log("CustomerAddress: ");
        console.log(customerAddress);
        console.log("--------------");
    }
    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <hr></hr>
            <br></br>
            <p> <b>Date:</b> {order.date} | <b>Time:</b> {order.time} | <b>Total:</b> {order.total} EGP | <b>Payment Method:</b> {order.payment_method}  </p>
            <p> <b>Status:</b> {order.status}</p>
            <hr></hr>

            <br></br>
            <p> <b>Name:</b> {order.name} | <b>Email:</b> {order.email} </p>

            <h3>Address</h3>
            <p> <b>City:</b> {customerAddress.city} | <b>District:</b> {customerAddress.district} | <b>Street:</b> {customerAddress.street} | <b>Building No:</b> {customerAddress.building_no} | <b>Apartment No:</b> {customerAddress.apt_no} </p>
            <p> <b>Description:</b> {customerAddress.desscription}</p>

            <hr></hr>

            <br></br>
            <h2>Items List</h2>
            {orderItems.map((value, index) =>
                <p key={index}> <b>Name:</b> {value.name} | <b>Price:</b> {value.price} | <b>Quantity:</b> {value.quantity}  </p>

            )}




        </>

    );
}

export default CashierOrderDetails;
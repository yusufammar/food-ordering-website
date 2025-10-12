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
    const [customerDetails, setCustomerDetails] = useState({});


    useEffect(getOrderDetailsRequest, []);
    // useEffect(display, [orderItems, customerDetails]);


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
        setCustomerDetails(res.data.customerDetails);
    }

    function display() {
        console.log("Order Items: ");
        console.log(orderItems);
        console.log("--------------");
        console.log("Customer Details: ");
        console.log(customerDetails);
        console.log("--------------");
    }
    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <>
        
            <NavBar role={roleRequired}/>

            <hr></hr>
            <br></br>
            <p> <b>Date:</b> {order.date} | <b>Time:</b> {order.time} | <b>Total:</b> {order.total} EGP | <b>Payment Method:</b> {order.payment_method}  </p>
            <p> <b>Status:</b> {order.status}</p>
            <hr></hr>

            {/* //get profile separatetly, like address or make a join query for details and address */}
            <br></br>
            <p> <b>Name:</b> {customerDetails.name} | <b>Email:</b> {customerDetails.email} | <b>Phone No:</b> {customerDetails.phone_no} </p>

            <h3>Address</h3>
            <p> <b>City:</b> {customerDetails.city} | <b>District:</b> {customerDetails.district} | <b>Street:</b> {customerDetails.street} | <b>Building No:</b> {customerDetails.building_no} | <b>Apartment No:</b> {customerDetails.apt_no} </p>
            <p> <b>Description:</b> {customerDetails.desscription}</p>

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
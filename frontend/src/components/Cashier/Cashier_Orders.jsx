import App from '../../App';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CashierOrders() {
    const navigate = useNavigate();
    const roleRequired = "cashier";
    const user = utils.getSavedUser();
    const audio = useRef(new Audio("/sounds/new-order.wav")); // This ensures one stable audio instance for the lifetime of the component.
    const audio2 = useRef(new Audio("/sounds/volumeOn.wav"));


    const [orders, setOrders] = useState([]);
    const [audioSwitch, setAudioSwitch] = useState(false);

    useEffect(getOrdersRequest, []);
    useEffect(getOrderStream, []);
    useEffect(updateAudioSwitch, [audioSwitch]);

    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getOrdersRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + "/cashier/getOrders", config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));
    }


    function getOrderStream() {
        const evtSource = new EventSource(App.baseUrl + `/cashier/orderStream?token=${user.token}`);

        evtSource.onmessage = handleNewOrder;
        evtSource.onerror = (err) => utilsErrorHandling.handleFailureStandard(err, navigate);

        //Note: onmessage is property of eventsource object that takes a function
        // evtSource.addEventListener("message", handleNewOrder);//equivalent

        // Cleanup when component unmounts 
        // Return statment (function reference, not invoked imediately) inside useeffect with empty dependendy array gets executed when component unmounts
        return () => handlePageClose(evtSource)
    }


    function updateOrderStatusRequest(order, newStatus) {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + `/cashier/updateOrderStatus/${order.id}/${newStatus}`, config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    async function handleNewOrder(event) {

        const newOrder = JSON.parse(event.data);

        // console.log("📦 New Order Received:", newOrder);
        // Merge new order with the current state safely (dig deep, only worked this way)
        setOrders(prevOrders => [newOrder, ...prevOrders]);

        //Play Audio (1st Interaction on Page Needed, if page refreshed, you need to press anywhere on page for sound to be allowed)
        try {
            await audio.current.play();
        }
        catch (err) {
            console.log(err);
        }
    }

    function handlePageClose(evtSource) {
        evtSource.close();
        console.log("SSE connection closed");
    };


    function handleSuccess(res) {
        // console.log(res.data.orders[0]);
        setOrders(res.data.orders);

        if (res.data.message)
            alert(res.data.message);
    }


    function viewOrderItems(value, index) {
        const data = { state: { order: value } };
        // console.log(data);
        navigate('/cashierOrderDetails', data); // data passed to next page
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  

    function handleMute() {
        setAudioSwitch(false);
    }
    async function handleUnmute() {
        setAudioSwitch(true);
        await audio2.current.play();
    }

    function updateAudioSwitch() {
        if (audioSwitch == false) {
            audio.current.volume = 0;
        }
        else if (audioSwitch == true)
            audio.current.volume = 1;
    }

    return (
        <>
            <NavBar role={roleRequired}/>

            <div className='titleFlexDiv'>
                <h1>Orders</h1>
                {audioSwitch ? <button onClick={handleMute}>🔔</button> : <button onClick={handleUnmute}>🔇</button>}
            </div>


            {orders.map((value, index) =>
                <p key={index}> <b>Date:</b> {value.date} | <b>Time:</b> {value.time} | <b>Name:</b> {value.name} | <b>Email:</b> {value.email} | <b>Total:</b> {value.total} EGP | <b>Payment Method:</b> {value.payment_method} | <b>Status:</b> {value.status} |
                    {value.status == "Pending" ? <button className='greenButton' onClick={() => updateOrderStatusRequest(value, "Accepted")}> Accept </button> :
                        <button className='redButton' onClick={() => updateOrderStatusRequest(value, "Pending")}> Cancel </button>
                    }
                    <button onClick={() => viewOrderItems(value, index)}> Details </button>
                </p>

            )}

        </>

    );
}

export default CashierOrders;



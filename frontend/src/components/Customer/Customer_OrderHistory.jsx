import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';
import '../../styles/orderHistory.css'
import '../../styles/app.css'


import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

import HistoryIcon from '@mui/icons-material/History';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import AlarmIcon from '@mui/icons-material/AccessAlarm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';



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
        <div className='pageDiv'>
            <NavBar role={roleRequired} />

            <div className='header'>
                <HistoryIcon sx={{ color: 'blue', fontSize: 40 }} />
                <a>Order History</a>
            </div>

            <div className='orders'>


                {orders.map((value, index) =>

                    <div key={index} className='order' onClick={() => viewOrderItems(value, index)}>

                        <div className='details'>
                            {/* Date: {value.date}  <br /> */}
                            {/* Time: {value.time} <br/> */}
                            {/* Status: {value.status} */}

                            <div className='detail'>
                                <TodayIcon /> {value.date} 
                            </div>

                            <div className='detail'>
                                <AlarmIcon /> {utils.convertTime(value.time)}
                            </div>


                        </div>

                        <div className='details'>
                            {/* Total: {value.total} € <br/> */}
                            {/* Payment: {value.payment_method} */}

                            <div className='detail'>
                                {/* <AlarmIcon/>  */}
                                <ShoppingCartIcon />
                                {value.total} €
                            </div>

                            <div className='detail'>
                                <PaymentIcon />
                                {value.payment_method}

                                {/* {value.total}  € */}
                            </div>

                        </div>

                        <div className='detail'>
                            {value.status == "Pending" && <HistoryToggleOffIcon />}
                            {value.status == "Accepted" && <CheckCircleOutlineRoundedIcon sx={{ color: "green" }} />}
                        </div>


                        {/* <button onClick={() => viewOrderItems(value, index)}> Details </button> */}

                    </div>

                )}

            </div>


        </div>

    );
}

export default CustomerOrderHistory;
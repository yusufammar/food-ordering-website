import App from '../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import UserBar from './UserBar';

import * as utils from '../utils';
import * as utilsErrorHandling from '../utils_errorHandling';
import * as utilsInputValidation from '../utils_inputValidation';

function CustomerHome() {
    const navigate = useNavigate();
    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [products,setProducts] = useState([]);
    const [cart,setCart] = useState([]);

    useEffect(getProducts,[]);
    useEffect(updateProducts,[products]);
    useEffect(updateCart,[cart]);
    //----------------------------

    function getProducts(){
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + "/user/getProducts", config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err));

    }

    function updateProducts(){
        console.log("Products: ");
        console.log(products);
        console.log("--------------");
    }
    function updateCart(){
        console.log("Cart: ");
        console.log(cart);
        console.log("--------------");
    }

    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  
    
    function handleSuccess(res){
        // console.log(res.data);
        setProducts(res.data.products);
    }

    function addToCart(value, index){
        //add logic
        // if not exists -> add object + quantity field =1
        // if exist -> increment quantity field

        console.log(value);
        setCart([...cart, value]);
        
    }

    function removeFromCart(value, index){
        //decrement quantity field
        //check if quantity = 0, remove object at index
    }

    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Customer Home</h1>

            
            {products.map((value, index) => 
                   <button key={index} onClick={()=> addToCart(value,index)}> {value.name} </button>
            )}

            <h2>Cart</h2>
            {cart.map((value, index) => 
                   <p key={index}> {value.name} </p>
            )}

          

        </>

    );
}

export default CustomerHome;
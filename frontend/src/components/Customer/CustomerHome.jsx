import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

function CustomerHome() {
    const navigate = useNavigate();
    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(getProductsRequest, []); //this should be blocked userbar gives access denied
    useEffect(updateProducts, [products]);
    useEffect(updateCart, [cart]);

    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getProductsRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + "/user/getProducts", config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    async function handleCheckoutRequest(e) {
        e.preventDefault();

        const data = [
            { key: "cart", value: cart, type: "array", trim: 0, required: 1 },
            { key: "userID", value: user.id, type: "number", trim: 0, required: 1 },
            { key: "total", value: total, type: "number", trim: 0, required: 1 },
        ];

        const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);

        if (!dataValid) {
            return utilsErrorHandling.handleDataInvalid(errMessage); // stopping condition
        }
        //----------------------------------------
        const config = { headers: { authorization: user.token } };

        console.log(transformedData);
        return axios.post(App.baseUrl + "/user/checkoutOrder", transformedData, config)
            .then(res => handleCheckoutSeccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err));
    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  
    function handleCheckoutSeccess(res) {
        utilsErrorHandling.handleSuccessStandard(res)
        window.location.reload();
    }

    function handleSuccess(res) {
        setProducts(res.data.products);
    }

    function updateProducts() {
        // console.log("Products: ");
        // console.log(products);
        // console.log("--------------");
    }
    function updateCart() {
        // console.log("Cart: ");
        // console.log(cart);
        // console.log("--------------");
        calculateTotal();
    }

    function addToCart(value, index) { // Approach: array (o(n) performance)
        //Logic
        // if not exists -> add object + quantity field =1
        // if exist -> increment quantity field

        let newItemName = value.name;
        let itemExists = false;

        for (let i = 0; i < cart.length; i++) {
            let item = cart[i];
            let itemName = item.name;

            if (itemName == newItemName) {
                itemExists = true;

                // Clone cart to avoid mutating React state directly
                // Reason: to be safe follow react mutability rules, in order for react to detect state variable has been mutated so it rerenders properly
                const updatedCart = [...cart];

                // Remove the existing item at index i
                updatedCart.splice(i, 1);

                // Clone the item object and increment quantity
                const updatedItem = { ...item };
                updatedItem.quantity++;

                // Insert the updated item back at the same index in the cloned cart
                updatedCart.splice(i, 0, updatedItem);

                // Update the state with the new array (new cart)
                setCart([...updatedCart]);
                break;
            }

        }

        if (itemExists == false) {
            value['quantity'] = 1;
            setCart([...cart, value]);
        }

        /*
        Two approaches for managing cart:
 
        1. Array + loop (current method)
        - Logic: scan array to find item; increment quantity or add new item
        - Performance: O(n) lookup
        - Pros: simple, keeps item order naturally, easy to reason about
        - Cons: slightly slower for large carts
 
        2. Map/object (grouping by item name/id)
        - Logic: use item name as key; update quantity or add new key
        - Performance: O(1) average lookup (hash table), rare worst-case O(n)
        - Pros: fast updates, very simple lookup
        - Cons: order management requires extra array or additional logic, slightly more memory
        */

    }

    function removeFromCart(index) {
        const updatedCart = [...cart]; // Clone cart
        updatedCart.splice(index, 1);  // Remove the existing item at index i
        setCart([...updatedCart]);  // Update the state with the new array (new car)
    }

    function decrementQunatity(item, index) { //check if quantity = 0, remove object at index
        // Clone cart to avoid mutating React state directly
        // Reason: to be safe follow react mutability rules, in order for react to detect state variable has been mutated so it rerenders properly
        const updatedCart = [...cart];

        // Remove the existing item at index i
        updatedCart.splice(index, 1);

        // Clone the item object and decrement quantity
        const updatedItem = { ...item };
        updatedItem.quantity--;

        if (updatedItem.quantity > 0) // if item quantity greater than 0, insert back
            // Insert the updated item back at the same index in the cloned cart
            updatedCart.splice(index, 0, updatedItem);

        // Update the state with the new array (new cart)
        setCart([...updatedCart]);
    }

    function incrementQunatity(item, index) {
        // Clone cart to avoid mutating React state directly
        // Reason: to be safe follow react mutability rules, in order for react to detect state variable has been mutated so it rerenders properly
        const updatedCart = [...cart];

        // Remove the existing item at index i
        updatedCart.splice(index, 1);

        // Clone the item object and increment quantity
        const updatedItem = { ...item };
        updatedItem.quantity++;

        // Insert the updated item back at the same index in the cloned cart
        updatedCart.splice(index, 0, updatedItem);

        // Update the state with the new array (new cart)
        setCart([...updatedCart]);
    }


    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  

    function calculateTotal() {
        let x = 0;

        for (let item of cart) {
            let itemQuantity = item.quantity;
            let itemPrice = item.price;
            x += itemQuantity * itemPrice;
        }
        setTotal(x);
    }

    return (
        <>
            <NavBar></NavBar>

            <UserBar role={roleRequired}></UserBar>

            <h1>Customer Home</h1>


            {products.map((value, index) =>
                <button key={index} onClick={() => addToCart(value, index)}> {value.name} </button>
            )}

            <h2>Cart</h2>
            {cart.map((value, index) =>
                <p key={index}> {value.name} | Quantity: {value.quantity} | Price: {value.price} |
                    | <button onClick={() => incrementQunatity(value, index)}> + </button> |
                    | <button onClick={() => decrementQunatity(value, index)}> - </button> |
                    | <button onClick={() => removeFromCart(index)}> X </button>
                </p>

            )}

            <h2>Total: {total.toFixed(2)} EGP</h2>  <button onClick={handleCheckoutRequest}> Checkout </button>



        </>

    );
}

export default CustomerHome;
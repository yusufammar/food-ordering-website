import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';
import '../../styles/home.css'

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';
import CartSidebar from './CartSidebar';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function CustomerHome() {
    const navigate = useNavigate();
    const roleRequired = "customer";
    const user = utils.getSavedUser();

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(getProductsRequest, []); //this should be blocked userbar gives access denied

    //-----------------------------
    // HTTP Requests
    //------------------------------

    function getProductsRequest() {
        const config = { headers: { authorization: user.token } };

        axios.get(App.baseUrl + "/user/getProducts", config)
            .then(res => handleSuccess(res))
            .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  

    function handleSuccess(res) {
        setProducts(res.data.products);
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

    function openNav() {
        document.getElementById("cartSidebar").classList.add("active");
        document.getElementById("cartOverlay").classList.add("active");
    }

    //-------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------  


    return (
        <div className='pageDiv'>

            <NavBar role={roleRequired}/>


            <div className='productsItems'>

                {products.map((value, index) =>
                    // <button key={index} onClick={() => addToCart(value, index)}> {value.name} </button>

                    <div className="product" key={index} onClick={() => addToCart(value, index)}>
                        <div className='productImage'>
                            <FastfoodIcon sx={{ fontSize: 80, color: 'blue' }}></FastfoodIcon>
                        </div>

                        <div className='productItemNamePrice'>

                            <div className='productName'>
                                {value.name}
                                {/* ggggg   ggggggggg ggggggggg ggggggg gggggg gggggggggggg ggggggggggggggggggggggggggg */}
                            </div>

                            <a>{value.price} €</a>

                        </div>
                    </div>
                )}

            </div>

            {/* <div className='spacer'></div> */}

            <div className='buttonDiv'>
                <button className='cartButton' onClick={openNav}>
                    <div className='buttonSpacer'></div>
                    <div><ShoppingCartIcon sx={{ fontSize: 25 }}></ShoppingCartIcon></div>

                    <div className='buttonSpacer'>
                        {cart.length > 0 && <a> {cart.length}</a>}
                        {/* <a>   View Cart</a> */}

                    </div>
                </button>
            </div>


            <CartSidebar user={user} cart={cart} setCart={setCart}></CartSidebar>



        </div>

    );
}

export default CustomerHome;
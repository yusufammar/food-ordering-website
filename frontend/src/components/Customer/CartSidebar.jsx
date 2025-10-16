import App from '../../App';
import axios from 'axios';
import { useState, useEffect, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import UserBar from '../UserBar';
import '../../styles/cart.css'

import * as utils from '../../utils';
import * as utilsErrorHandling from '../../utils_errorHandling';
import * as utilsInputValidation from '../../utils_inputValidation';

import LocalMallIcon from '@mui/icons-material/LocalMall';
import MoneyIcon from '@mui/icons-material/Money';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';


function CartSidebar({ user, cart, setCart }) {
    const navigate = useNavigate();
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);

     const settings = utils.getSettings();
        // console.log(settings);
    const deliveryFee= Number(settings.deliveryFee);


    useEffect(updateCart, [cart]);
    useEffect(calculateTotal, [subTotal]);
    
   
    //-----------------------------
    // HTTP Requests
    //------------------------------


    async function handleCheckoutRequest(e) {
        e.preventDefault();

        if (user.role!="customer"){
            utils.setCart(cart);
            alert("Please Login to make an order");
            return navigate("/login");
        }

        //-------------------------------------------------
        const data = [
            { key: "cart", value: cart, type: "array", trim: 0, required: 1 },
            { key: "userID", value: user.id, type: "number", trim: 0, required: 1 },
            { key: "subTotal", value: subTotal, type: "number", trim: 0, required: 1 },
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
            .catch(err => handleCheckoutFailure(err));
    }


    //-------------------------------------------------------
    // Event Handlers
    //-------------------------------------------------------  
    function handleCheckoutSeccess(res) {
        utilsErrorHandling.handleSuccessStandard(res)
        utils.unsetCart();
        window.location.reload();
        
    }

    function handleCheckoutFailure(err){
        utils.setCart(cart);
        utilsErrorHandling.handleFailureStandard(err,navigate)

    }

    function updateCart() {
        // console.log("Cart: ");
        // console.log(cart);
        // console.log("--------------");
        calculateSubTotal();
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

    function calculateSubTotal() {
        let x = 0;

        for (let item of cart) {
            let itemQuantity = item.quantity;
            let itemPrice = item.price;
            x += itemQuantity * itemPrice;
        }
        setSubTotal(x);
    }

     function calculateTotal(){
        let sum= subTotal+deliveryFee;
        setTotal(sum);
    }


    function closeNav() {
        document.getElementById("cartSidebar").classList.remove("active");
        document.getElementById("cartOverlay").classList.remove("active");
    }

    function clearCart(){
        setCart([]);
        utils.unsetCart();
    }


    return (
        <>

            <div id="cartSidebar" className='cartSidebar'>

                <div className='cartTile' >
                    <div className='titleBox'>
                    <LocalMallIcon/>
                    <h2>Cart</h2> </div>
                     <ClearAllIcon className='clearIcon' sx={{color:"red",fontSize:40}} onClick={clearCart}/>

                </div>

                <div className='items'>
                    {cart.map((value, index) =>

                        <div key={index} className='cartItem'>
                            <div className='cartItemNamePrice'>

                                <div className='nameDiv'>{value.name}   
                                     {/* gggggggggggggg ggggggggg ggggggg gggggg gggggggggggg  */}
                                </div>
                                                   
                                <a>{value.price} €</a>

                            </div>


                            <div className='quantityDiv'>   

                                <div className='quantityChanger' onClick={() => decrementQunatity(value, index)}> - </div>

                                <div>{value.quantity}</div>

                                <div className='quantityChanger' onClick={() => incrementQunatity(value, index)}> + </div>

                            </div>

                            <div className='deleteDiv'>
                                <DeleteIcon onClick={() => removeFromCart(index)}/>
                            </div>

                            {/* <a > X </a> */}



                        </div>

                    )}
                </div>
                <div className='bottomDiv'>
                <div className='sub-paymentDiv'>
                    <a>Subtotal</a>  <a>{subTotal.toFixed(2)} €</a>
                </div>

                   <div className='sub-paymentDiv'>
                    <a>Delivery Fee</a>  <a>{deliveryFee} €</a>
                </div>

                <br/>

                   <div className='paymentDiv'>
                    <a>Total</a>  <a>{total.toFixed(2)} €</a>
                </div>



                <div className='paymentDiv'>
                    <div className='box1'>  <a>Payment</a> </div>

                    <div className='box2'>
                        <div className='box3'> <MoneyIcon sx={{ color: 'green' }}/></div>
                        <div className='box4'> <a>Cash</a></div>
                    </div>

                </div>

                <br></br>
                <button className='checkoutButton' onClick={handleCheckoutRequest}>
                    <div><ShoppingCartCheckoutIcon/></div>

                    <div><a>Checkout </a> </div>
                </button>
            </div>

            </div>

            <div id="cartOverlay" className="overlay" onClick={closeNav}/>

        </>

    );
}

export default CartSidebar;
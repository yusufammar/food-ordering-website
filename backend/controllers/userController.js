require('dotenv').config();

const pool = require('../config/db.js')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET

const user = require('../models/user');
const address = require('../models/address');
const product = require('../models/product');
const order = require('../models/order');
const order_items = require('../models/order_items');


const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');


function sampleRequest(req, res) {
    console.log("Sample Request");
    res.json({ message: "Sample Request successful" });
}

async function getProducts(req, res) {

    try {
        const result = await product.getProducts();
        const products = result.rows;
        // console.log(products);
        return res.json({ products })

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}

async function checkoutOrder(req, res) {
    let { cart, userID, total } = req.body;

    const data = [
        { key: "cart", value: cart, type: "array", trim: 0, required: 1 },
        { key: "userID", value: userID, type: "number", trim: 0, required: 1 },
        { key: "total", value: total, type: "number", trim: 0, required: 1 },
    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition
    //-----------------------------

    const client = await pool.connect();

    try {
        let { cart, userID, total } = transformedData;
        // console.log(cart);
        await client.query('BEGIN');
        const orderID = await order.insertOrder(client, userID, total);
        // console.log("Order ID: " + orderID);
        await order_items.insertOrderItems(client, orderID, cart);
        await client.query('COMMIT');

        const message = "Order Checkout Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}


async function getOrders(req, res) {
    const userAttached= req.user;

    try {
        const result = await order.getOrders(userAttached.id);
        
        const orders = result.rows;
        // console.log(orders);

        // //Test (Date Parsability & Comparibility)
        // const date1= orders[0].date;
        // const date2= orders[1].date;
        // console.log(date1);
        // console.log(date2);

        // if (date1>date2)
        //     console.log(true);
        // else
        //     console.log(false);
        // //----------------------

        
        return res.json({ orders })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }
} 


async function getOrderItems(req, res) {
    
    const orderID = req.params.orderID; 
    // console.log(orderID);

    try {
        const result = await order_items.getOrderItems(orderID);
        
        const orderItems = result.rows;
        return res.json({ orderItems })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }
}


async function getProfile(req, res) {
    const userAttached= req.user;
    // console.log(userAttached);

    try {
        const result = await user.getProfile(userAttached.id);
        const profile = result.rows[0];

        const result2= await address.getAddress(userAttached.id);
        const profileAddress = result2.rows[0];

        // console.log(profile);
        // console.log(profileAddress);
                
        return res.json({ profile, profileAddress})
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }
} 






module.exports = { sampleRequest, getProducts, checkoutOrder, getOrders, getOrderItems, getProfile };
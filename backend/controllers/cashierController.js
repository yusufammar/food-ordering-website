require('dotenv').config();
const pool = require("../config/db");

const user = require('../models/user')
const product = require('../models/product')
const order = require('../models/order')

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');


async function getOrders(req, res) {
    // const userAttached= req.user;

    try {
        const result = await order.getAllOrders();
        
        const orders = result.rows;
        // console.log(orders);
       
        
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



async function orderStream(req, res) {
  // Tell browser this is an SSE connection
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Optional: flush headers immediately
  res.flushHeaders?.();

  // Get a dedicated client connection (not from pool query shortcut)
  const client = await pool.connect();

  // Start listening for "new_order" notifications
  await client.query("LISTEN new_order");

  client.on("notification", (msg) => {
    // Payload is a stringified JSON row from trigger
    const payload = msg.payload;
    res.write(`data: ${payload}\n\n`); // SSE format
  });

  // If cashier closes the page, clean up
  req.on("close", () => {
    client.release();
  });
}




module.exports = { getOrders, getOrderItems, orderStream};

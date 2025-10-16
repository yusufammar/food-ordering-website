const user = require('./models/user');
const address = require('./models/address.js');
const product = require('./models/product');
const order = require('./models/order');
const settings = require('./models/settings');
const order_items = require('./models/order_items');

const pool = require('./config/db.js')

async function executeDB() {
    try {
        await order.dropOrdersTable();
        console.log("Orders Table Dropped");
        await order_items.dropOrderItemsTable();
        console.log("Order Items Table Dropped");
        //------------------------------
        await order.createOrdersTable();
        console.log("Order Table Created");
        await order_items.createOrderItemsTable();
        console.log("Order Items Table Created");

        //------------

        await order.implementOrdersTrigger();
        console.log("Orders Trigger Implemented");


        //----------------------------------
        // Terminal stays open because the database connection pool is still active, keeping Node.js running until closed
        await pool.end();
        console.log("DB Connection Pool Closed");
        //---------------------------------------------
        console.log("Execution Complete");
    }
    catch (err) {
        console.error(err)
    }
}


executeDB();



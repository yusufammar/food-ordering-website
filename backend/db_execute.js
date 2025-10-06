const user = require('./models/user');
const address = require('./models/address.js');
const product = require('./models/product');
const order = require('./models/order');
const order_items = require('./models/order_items');

const pool = require('./config/db.js')

async function executeDB() {
    try { 
   
        //--------------------
        //Custom Insterts
        //--------------------
        // await user.insertCashier();
        // console.log("Cashier Inserted");

        //  await order.implementOrdersTrigger();
        // console.log("Orders Trigger Implemented");



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



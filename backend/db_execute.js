const user = require('./models/user');
const address = require('./models/address.js');
const product = require('./models/product');
const order = require('./models/order');
const settings = require('./models/settings');
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

        // await settings.createSettingsTable();
        // console.log("Settings Table Created");

        // await settings.insertSetting("storeName", "Store Name");
        // console.log("Default Store Name Insterted");

        // await product.dropProductsTable();
        // console.log("Products Table Dropped");
        // await product.createProductsTable();
        // console.log("Products Table Created");

        await user.dropUsersTable();
        console.log("Products Table Dropped");
        await user.createUsersTable();
        console.log("Products Table Created");

        await user.insertAdmin();
        console.log("Admin Inserted");

        await user.insertCashier();
        console.log("Cashier Inserted");

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



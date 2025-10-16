const user = require('./models/user');
const address = require('./models/address.js');
const product = require('./models/product');
const order = require('./models/order');
const order_items = require('./models/order_items');
const settings = require('./models/settings');

const pool = require('./config/db.js')

async function setupDB() {
    try { //Note: you need to drop table, just clearing wont add the new columns you added + plus its easier (no need to reset identity)

        //-------------------------------
        //Drop Tables (if Exists) --> *if exists: needed else if doesnt exist throw error & stop execution
        //---------------------------------
        await user.dropUsersTable();
        console.log("Users Table Dropped");
        await address.dropAddressesTable();
        console.log("Addresses Table Dropped");
        await order.dropOrdersTable();
        console.log("Orders Table Dropped");
        await order_items.dropOrderItemsTable();
        console.log("Order Items Table Dropped");
        await settings.dropSettingsTable();
        console.log("Settings Table Dropped");

        await product.dropProductsTable();
        console.log("Products Table Dropped");



        //-------------------------------
        //Create Tables (if not exists)
        //-------------------------------
        await user.createUsersTable();
        console.log("User Table Created"); // await making things run sequentially
        await address.createAddressesTable();
        console.log("Address Table Created");
        await order.createOrdersTable();
        console.log("Order Table Created");
        await order_items.createOrderItemsTable();
        console.log("Order Items Table Created");
        await settings.createSettingsTable();
        console.log("Settings Table Created");

        await product.createProductsTable();
        console.log("Products Table Created");


        //--------------------
        //Custom Insterts / Functions
        //--------------------
        await user.insertAdmin();
        console.log("Admin Inserted");
        
        await user.insertCashier();
        console.log("Cashier Inserted");

        await settings.insertSetting("storeName","Store Name");
        console.log("Default Store Name Insterted");

        await settings.insertSetting("deliveryFee",0);
        console.log("Default Delivery Fee Insterted")

        await order.implementOrdersTrigger();
        console.log("Orders Trigger Implemented");

       



        //----------------------------------
        // Terminal stays open because the database connection pool is still active, keeping Node.js running until closed
        await pool.end();
        console.log("DB Connection Pool Closed");
        //---------------------------------------------
        console.log("Setup Complete");
    }
    catch (err) {
        console.error(err)
    }
}

setupDB();



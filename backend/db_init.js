const user = require('./models/user');
const address = require('./models/address.js');
const product = require('./models/product');

const pool = require('./config/db.js')

async function setupDB() {
    try {

        //Users Table
        await user.createUsersTable();
        console.log("User Table Created"); // Runs after createUsersTable() due to await making things run sequentially
        await user.clearUsersTable();
        console.log("User Table Cleared");


        //Address Table
        await address.createAddressesTable();
        console.log("Address Table Created");
        await address.clearAddressesTable();
        console.log("Address Table Cleared");



        //Product Table
        await product.createProductsTable();
        console.log("Products Table Created");

        //--------------------
        await user.insertAdmin();
        console.log("Admin Inserted");




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



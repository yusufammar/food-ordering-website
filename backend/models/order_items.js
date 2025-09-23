const pool = require("../config/db");
const utils = require('../utils');

//----------------
//Schema
//----------------

function createOrderItemsTable() {

    const query = `
       CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            arabic_name VARCHAR(50),
            price NUMERIC(10,2) NOT NULL,
            quantity NUMERIC(10,2) NOT NULL,         
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE SET NULL
        )
    `;

    return pool.query(query);
}

//----------------------------------
//#DB_Init Methods / Helper Methods
//----------------------------------
function clearOrdersItemsTable() {
    const query = `TRUNCATE TABLE order_items RESTART IDENTITY`;
    return pool.query(query)
}

function dropOrderItemsTable() {
    const query = `DROP TABLE IF EXISTS order_items;`;
    return pool.query(query)
}

//--------------------------------------------

async function insertOrderItems(client, orderID, cart) {

    addOrderIdToCartItems(cart,orderID); //--> changes happen in "cart itself", no extra variable need
    
    const columnsNeeded = ["name", "arabic_name", "price", "quantity", "orderID"];
    const { valuesArray, placeholdersString } = utils.prepareMultipleInsert(cart, columnsNeeded);

    // console.log(valuesArray);
    // console.log(placeholdersString);

    const query = `INSERT INTO order_items (name, arabic_name, price, quantity, order_id) VALUES ${placeholdersString};`;
    const values = valuesArray;

    // return pool.query(query, values);
    return client.query(query, values);

}

//-----------------------------------
//Helper Methods
//-----------------------------------

function addOrderIdToCartItems(cart,orderID){

    for (let item of cart){
        item.orderID= orderID;
    }
    return;
}

module.exports = { createOrderItemsTable,clearOrdersItemsTable,dropOrderItemsTable, insertOrderItems };

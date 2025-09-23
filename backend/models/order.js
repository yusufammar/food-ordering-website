const pool = require("../config/db");
const utils = require('../utils');

//----------------
//Schema
//----------------

function createOrdersTable() {

    const query = `
       CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            time TIME NOT NULL,
            total NUMERIC(10,2) NOT NULL DEFAULT 0,
            payment_method VARCHAR(20) NOT NULL DEFAULT 'CASH',
            status VARCHAR(50) NOT NULL DEFAULT 'Pending',
            cancelled BOOLEAN NOT NULL DEFAULT false,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL
        )
    `;

    return pool.query(query);


}

//----------------------------------
//#DB_Init Methods / Helper Methods
//----------------------------------
function clearOrdersTable() {
    const query = `TRUNCATE TABLE orders RESTART IDENTITY CASCADE`;
    return pool.query(query)
}

function dropOrdersTable() {
    const query = `DROP TABLE IF EXISTS orders CASCADE`;
    return pool.query(query)
}

//--------------------------------------------

async function insertOrder(client, userID, total) {

    const dateObject = new Date();
    const date = dateObject.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
    const time = dateObject.toTimeString().split(" ")[0]; // Format time as HH:MM:SS
    const paymentMethod = "CASH";


    const query = `INSERT INTO orders (date, time, total, payment_method, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING id;`;
    const values = [date, time, total, paymentMethod, userID];

    // return pool.query(query, values);
    // return client.query(query, values);

     const result = await client.query(query, values);
     // const result = await pool.query(query, values);

    const orderID = result.rows[0].id;
    return orderID;

}

//-----------------------------------
//Helper Methods
//-----------------------------------


module.exports = { createOrdersTable, clearOrdersTable, dropOrdersTable, insertOrder };

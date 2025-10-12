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
async function implementOrdersTrigger() { // **doccument (explain)

  const triggerFunctionQuery = `
      CREATE OR REPLACE FUNCTION notify_new_order() RETURNS trigger AS $$
    BEGIN
      PERFORM pg_notify('new_order', row_to_json(NEW)::text);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `;

  await pool.query(triggerFunctionQuery);

  const createTriggerQuery = `
      DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'order_notify'
      ) THEN
        CREATE TRIGGER order_notify
        AFTER INSERT ON orders
        FOR EACH ROW EXECUTE FUNCTION notify_new_order();
      END IF;
    END;
    $$;
    `;

  return pool.query(createTriggerQuery);
}


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
  const date = dateObject.toLocaleDateString('en-CA');
  const time = dateObject.toLocaleTimeString('en-GB');
  const paymentMethod = "CASH";


  const query = `INSERT INTO orders (date, time, total, payment_method, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING id;`;
  const values = [date, time, total, paymentMethod, userID];

  // console.log(dateObject)
  // console.log(date);
  // console.log(values);

   const result = await client.query(query, values);
  // const result = await pool.query(query, values);

  const orderID = result.rows[0].id;
  return orderID;

}

function getOrders(userID) {
  const query = `SELECT * FROM orders WHERE user_id=$1 ORDER BY date DESC, time DESC`;
  const values = [userID];

  return pool.query(query, values);
}

function getAllOrders() {
  // const query = `SELECT * FROM orders ORDER BY date DESC, time DESC`;
  // const query = `SELECT * FROM orders o JOIN users u ON o.user_id= u.id;`;
  const query = `SELECT  o.*, u.name, u.email, u.phone_no 
    FROM orders o  
    JOIN users u ON o.user_id = u.id  
    ORDER BY date DESC, time DESC`;

  return pool.query(query);
}


function updateOrderStatus(orderID, newStatus) {
  const query = `UPDATE orders SET status=$1 WHERE id=$2`;
  const values = [newStatus, orderID];

  return pool.query(query, values);
}


//-----------------------------------
//Helper Methods
//-----------------------------------


module.exports = { createOrdersTable, clearOrdersTable, dropOrdersTable, insertOrder, getOrders, getAllOrders, implementOrdersTrigger, updateOrderStatus };

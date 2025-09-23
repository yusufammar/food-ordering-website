const pool = require('../config/db.js')
const bcrypt = require('bcryptjs');

//----------------
//Schema
//----------------

function createUsersTable() {
  const query = `
   CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL
    ); 
  `;

  return pool.query(query);
}

//------------------------------------------------------

async function getUserCredentials(email) {

  const query = `SELECT * FROM users WHERE email=$1;`;
  const values = [email];

  const result = await pool.query(query, values);

  const users = result.rows;
  const userCredentials = result.rows[0];

  return userCredentials;
}


async function insertUser(client, name, email, password, role) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4)
    RETURNING id;`;
  const values = [name, email, hashedPassword, role];

  const result = await client.query(query, values);
  // const result = await pool.query(query, values);

  const userID = result.rows[0].id;
  return userID;
}

function deleteUserByID(userID) {

  const query = `DELETE FROM users WHERE id=$1`;
  const values = [userID];
  return pool.query(query, values);
}


//----------------------------------
//#DB_Init Methods / Helper Methods
//----------------------------------
function clearUsersTable() {
  const query = `TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
  return pool.query(query)
}

function dropUsersTable() {
    const query = `DROP TABLE IF EXISTS users CASCADE`; 
    return pool.query(query)

   // You can't drop the parent table by default because it would leave the child table with a broken foreign key reference. This is a safety feature.
  //To force the deletion, you must use the DROP TABLE parent_table_name CASCADE; command. This will also delete the foreign key constraint on the child table and potentially the child table itself if it has no other dependencies.
}


async function insertAdmin() {
  const adminPassword = 'admin';
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

  const query = `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4); `;
  const values = ['admin', 'admin', adminHashedPassword, 'admin'];
  return pool.query(query, values)
}




module.exports = {
  createUsersTable, clearUsersTable, dropUsersTable, insertAdmin,
  getUserCredentials, insertUser, deleteUserByID
};

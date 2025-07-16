const pool = require('../config/db.js')

//----------------
//Schema
//----------------
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Users table created or already exists");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

//------------------------------------------------------




module.exports= {createUsersTable};
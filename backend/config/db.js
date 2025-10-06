require('dotenv').config();
const { Pool } = require('pg');
const { types } = require("pg");
const DATE_OID = 1082; // OID for DATE (Column Type) in Postgres
types.setTypeParser(DATE_OID, (val) => val); // Override default parser: keep as string (to avoid changing it a date object and see changes in value due to timezones)


// const pool = new Pool({

//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD

// })

// For External Connections
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});



module.exports = pool;

// postgresql://food_app_user:Wo02nPm7vwsMAMSyn0Bbb8sbA7eAopWQ@dpg-d3hj9ppr0fns73cect70-a.frankfurt-postgres.render.com/food_app_db_9o2k
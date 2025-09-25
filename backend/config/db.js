require('dotenv').config();
const { Pool } = require('pg');
const { types } = require("pg");
const DATE_OID = 1082; // OID for DATE (Column Type) in Postgres
types.setTypeParser(DATE_OID, (val) => val); // Override default parser: keep as string (to avoid changing it a date object and see changes in value due to timezones)


const pool = new Pool({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD

})


module.exports = pool;
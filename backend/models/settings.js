const pool = require("../config/db");
const utils = require('../utils');

//----------------
//Schema
//----------------

function createSettingsTable() {

    const query = `
       CREATE TABLE IF NOT EXISTS settings (
            id SERIAL PRIMARY KEY,
            key VARCHAR(50) NOT NULL,
            value TEXT NOT NULL
        )
    `;

    return pool.query(query);
}

//----------------------------------
//#DB_Init Methods / Helper Methods
//----------------------------------
function clearSettingsTable() {
    const query = `TRUNCATE TABLE settings RESTART IDENTITY`;
    return pool.query(query)
}

function dropSettingsTable() {
    const query = `DROP TABLE IF EXISTS settings;`;
    return pool.query(query)
}

//--------------------------------------------

function insertSetting(key,value) {
  
    const query = `INSERT INTO settings (key, value) VALUES ($1,$2);`;
    const values = [key,value];

    return pool.query(query, values);
 

}

function updateSetting(key,value) {
  
    const query = `UPDATE settings SET value=$1 WHERE key=$2;`;
    const values = [value, key];

    return pool.query(query, values);
 

}

function getSetting(key) {
    const query = `SELECT * FROM settings WHERE key=$1`;
    const values = [key];

    return pool.query(query, values);
}

function getAllSettings() {
    const query = `SELECT * FROM settings`;
   
    return pool.query(query);
}


//-----------------------------------
//Helper Methods
//-----------------------------------



module.exports = { createSettingsTable,dropSettingsTable, clearSettingsTable, insertSetting, updateSetting, getSetting, getAllSettings };

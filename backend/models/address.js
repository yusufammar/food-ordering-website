const pool = require("../config/db");
const utils = require('../utils');

//----------------
//Schema
//----------------

function createAddressesTable() {

    const query = `
        CREATE TABLE IF NOT EXISTS addresses(
            id SERIAL PRIMARY KEY,
            city VARCHAR(50) NOT NULL,
            district VARCHAR(50) NOT NULL,
            street VARCHAR(50) NOT NULL,
            building_no INTEGER NOT NULL,
            apt_no INTEGER NOT NULL,
            description TEXT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
        );
    `; 

    //On delete cascade, means here if a change happens in the parent table (users), like a row delete then delete here too

    return pool.query(query);


}

//----------------------------------
//#DB_Init Methods / Helper Methods
//----------------------------------
function clearAddressesTable() {
    const query = `TRUNCATE TABLE addresses RESTART IDENTITY`;
    return pool.query(query)
}

function dropAddressesTable() {
    const query = `DROP TABLE IF EXISTS addresses;`;
    return pool.query(query)
}

//--------------------------------------------

function insertAddress(client, userID, city, district, street, buildingNo, apartmentNo, addressDescription) {

    const query = `INSERT INTO addresses (city, district, street, building_no, apt_no, description, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7);`;
    const values = [city, district, street, buildingNo, apartmentNo, addressDescription, userID];

    // return pool.query(query, values);
    return client.query(query, values);

}

//-----------------------------------
//Helper Methods
//-----------------------------------


module.exports = { createAddressesTable, clearAddressesTable, dropAddressesTable, insertAddress };

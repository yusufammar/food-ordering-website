const pool = require("../config/db");
const utils = require('../utils');

//----------------
//Schema
//----------------


function createProductsTable() {

    const query = `
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            arabic_name VARCHAR(50),
            category VARCHAR(50) NOT NULL,
            price NUMERIC(10,2) NOT NULL,
            img_filename TEXT
        );
    `;

    return pool.query(query);

}

//--------------------------------------------


async function insertProducts(productsArray) {

    await clearProductsTable();
    console.log("Products Table Cleared");
    //----------------------------------------------------------


    const columnsNeeded = ["Name", "Category", "Price", "Arabic Name", "Image Filename"];
    const { valuesArray, placeholdersString } = utils.prepareMultipleInsert(productsArray, columnsNeeded);

    // console.log(valuesArray);
    // console.log(placeholdersString);


    const query = `INSERT INTO products (name, category, price, arabic_name, img_filename) VALUES ${placeholdersString}; `;
    const values = valuesArray;

    return pool.query(query, values);
}

function getProducts() {
    const query = `SELECT * FROM products;`;

    return pool.query(query);
}

//-----------------------------------
//Helper Methods
//-----------------------------------
function clearProductsTable() {
    const query = `TRUNCATE TABLE products RESTART IDENTITY`;
    return pool.query(query)
}

function dropProductsTable() {
    const query = `DROP TABLE IF EXISTS products;`;
    return pool.query(query)
}

module.exports = { createProductsTable, clearProductsTable, dropProductsTable, insertProducts, getProducts };

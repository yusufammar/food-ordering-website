require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET

const user = require('../models/user');
const address = require('../models/address');
const product = require('../models/product');

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');


function sampleRequest(req, res) {
    console.log("Sample Request");
    res.json({ message: "Sample Request successful" });
}

async function getProducts(req, res) {
   

    try {
        const result = await product.getProducts();
        const products = result.rows;
        
        // const message = "Sign Up Successful";
        console.log(products);
        return res.json({ products })

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}



module.exports = { sampleRequest, getProducts };
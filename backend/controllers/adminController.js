require('dotenv').config();
const user = require('../models/user')
const product = require('../models/product')
const utils = require('../utils');

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const secretKey = process.env.SECRET

async function importProducts(req, res) {
    const { productsArray } = req.body

    const data = [
        { productsArray, required: 1 },
    ];

    const [requiredFieldsAvailable, missingFields, errMessage] = utils.checkRequiredFields(data);


    if (requiredFieldsAvailable) {
        try {
            await product.insertProducts(productsArray)
            const message = "Import Products Successful";
            console.log(message);
            return res.json({ message })
        }
        catch (err) {
            const errStatus = err.status || 500;
            console.error(err);
            return res.status(errStatus).json({ error: "Error: " + err.detail });
        }
    }
    else
        return res.status(400).json({ error: errMessage });



}




module.exports = { importProducts };

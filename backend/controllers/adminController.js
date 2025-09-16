require('dotenv').config();
const user = require('../models/user')
const product = require('../models/product')

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');


async function importProducts(req, res) {
    const { productsArray } = req.body

    const data = [
        { key: "productsArray", value: productsArray, type: "array", trim: 0, required: 1 },

    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition
    //-----------------------------

    try {
        let { productsArray } = transformedData
        await product.insertProducts(productsArray)
        const message = "Import Products Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}




module.exports = { importProducts };

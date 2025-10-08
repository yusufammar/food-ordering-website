require('dotenv').config();
const user = require('../models/user')
const product = require('../models/product')
const settings = require('../models/settings')

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

async function setStoreName(req, res) {
    const { storeName } = req.body

    const data = [
        { key: "storeName", value: storeName, type: "string", trim: 1, required: 1 },

    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition
    //-----------------------------

    try {
        let { storeName } = transformedData
        await settings.insertSetting("storeName",storeName)
        const message = "Set Store Name Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}


module.exports = { importProducts, setStoreName };

require('dotenv').config();

const pool = require('../config/db.js')

const user = require('../models/user');
const address = require('../models/address');
const product = require('../models/product');
const settings = require('../models/settings');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');



async function login(req, res) {
    let { email, password } = req.body;


    const data = [
        { key: "email", value: email, type: "email", trim: 1, required: 1 },
        { key: "password", value: password, type: "password", trim: 0, required: 1 },
    ];

    // console.log(data);

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition

    //--------------------------------------

    try {
        let { email, password } = transformedData;
        const userCredentials = await user.getUserCredentials(email);
        const userFound = (userCredentials != null);

        if (userFound) {
            const token = await handleUserFound(userCredentials, password);
            const message = "Login Successful";
            console.log(message);
            return res.json({ token, message });
        }
        else
            throwUserNotFoundErr();

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }



}

async function signUp(req, res) {
    let { name, email, password, phoneNo, city, district, street, buildingNo, apartmentNo, addressDescription } = req.body;

    const data = [
        { key: "name", value: name, type: "string", trim: 1, required: 1 },
        { key: "email", value: email, type: "email", trim: 1, required: 1 },
        { key: "password", value: password, type: "password", trim: 0, required: 1 },
        { key: "phoneNo", value: phoneNo, type: "phone_no", trim: 1, required: 1 },


        { key: "city", value: city, type: "string", trim: 1, required: 1 },
        { key: "district", value: district, type: "string", trim: 1, required: 1 },
        { key: "street", value: street, type: "string", trim: 1, required: 1 },
        { key: "buildingNo", value: buildingNo, type: "number", trim: 1, required: 1 },
        { key: "apartmentNo", value: apartmentNo, type: "number", trim: 1, required: 1 },
        { key: "addressDescription", value: addressDescription, type: "string", trim: 1, required: 0 },
    ];


    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition

    //---------------------------------

    const client = await pool.connect();
    try {
        let { name, email, password, phoneNo, city, district, street, buildingNo, apartmentNo, addressDescription } = transformedData;
        const role = 'customer';

        await client.query('BEGIN');  // start transaction   
        // pass client to both model functions, ✅ This ensures that all queries use the same connection and 
        // are inside the transaction. Now ROLLBACK will actually undo the user insert if the address insert fails.

        const userID = await user.insertUser(client, name, email, password, phoneNo, role);
        await address.insertAddress(client, userID, city, district, street, buildingNo, apartmentNo, addressDescription);

        await client.query('COMMIT');

        const message = "Sign Up Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        //handle if didn't get inserted in addresses table, delete from users table
        // await user.deleteUserByID(userID); // Note: delete something that doesn't exist wont harm
        await client.query('ROLLBACK');
        utilsErrorHandling.handleError(err, res);
    }
    finally { // a block that always runs regardless of prev return statements
        client.release();
    }

}

async function getProducts(req, res) {

    try {
        const result = await product.getProducts();
        const products = result.rows;
        // console.log(products);
        return res.json({ products })

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}

async function getSettings(req, res) {

    try {
        const result = await settings.getAllSettings();
        const settingsValues = result.rows;
        // console.log(products);
        return res.json({ settings: settingsValues })

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}

//------------------------------------------------
// Helper Methods

async function handleUserFound(userCredentials, password) {
    const passwordsMatch = await checkPassword(userCredentials, password);

    if (passwordsMatch) {
        const token = generateToken(userCredentials);
        return token;
    }
    else
        throwPasswordErr();
}



async function checkPassword(userCredentials, password) {
    const hashedPass = userCredentials.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPass);

    return passwordsMatch
}

function generateToken(userCredentials) {
    const id = userCredentials.id
    const name = userCredentials.name;
    const email = userCredentials.email;
    const role = userCredentials.role;

    const payload = { id, name, email, role };
    const options = { expiresIn: '1h' };
    // const secretKey = process.env.SECRET

    const token = jwt.sign(payload, secretKey, options);
    return token;
}


//----------------------------------------------------------------
// Error Throwing Methods

function throwUserNotFoundErr() {
    const err = new Error("User Not Found");
    err.name = "UserNotFoundError";
    err.status = 401;
    throw err;
}


function throwPasswordErr() {
    const err = new Error("Wrong Passsword");
    err.name = "InvalidPasswordError";
    err.status = 401;
    throw err;
}


module.exports = { login, signUp, getProducts, getSettings,
     checkPassword, throwPasswordErr, throwUserNotFoundErr };

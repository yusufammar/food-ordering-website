require('dotenv').config();
const user = require('../models/user')
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

    console.log(data);

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
    let { name, email, password } = req.body;

    const data = [
        { key: "name", value: name, type: "string", trim: 1, required: 1 },
        { key: "email", value: email, type: "email", trim: 1, required: 1 },
        { key: "password", value: password, type: "password", trim: 0, required: 1 },
    ];


    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition

    //---------------------------------

    try {
        let { name, email, password } = transformedData;
        const role = 'customer';
        await user.insertUser(name, email, password, role);
        const message = "Sign Up Successful";
        console.log(message);
        return res.json({ message })
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


module.exports = { login, signUp };

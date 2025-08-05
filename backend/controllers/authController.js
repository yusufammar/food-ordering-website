require('dotenv').config();
const user = require('../models/user')
const utils= require('../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET


async function login(req, res) {
    let { email, password } = req.body;
    console.log(req.body);

    const data = [
        { email, trim: 1, required: 1 },
        { password, trim: 0, required: 1 },
    ];

    const [dataValid, errMessage, transformedData] = utils.validateData(data);

    if (dataValid) {
        //next step
        let {email, password } = transformedData;
        try {
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
            const errStatus = err.status || 500;
            console.error(err);
            return res.status(errStatus).json({ error: err.name });
        }
    }
    else {
        console.error(errMessage);
        return res.status(400).json({ error: errMessage });
    }

}

async function signUp(req, res) {
    let { name, email, password } = req.body;
    console.log(req.body);

    const data = [
        { name, trim: 1, required: 1 },
        { email, trim: 1, required: 1 },
        { password, trim: 0, required: 1 },
    ];

    const [dataValid, errMessage, transformedData] = utils.validateData(data);

    if (dataValid) {
        //next step
        let { name, email, password } = transformedData;
        const role = 'customer';
        try {
            await user.insertUser(name, email, password, role);
            const message = "Sign Up Successful";
            console.log(message);
            return res.json({ message })
        }
        catch (err) {
            const errStatus = err.status || 500;
            console.error(err);
            return res.status(errStatus).json({ error: "Error: " + err.detail });
        }
    }
    else {
        console.error(errMessage);
        return res.status(400).json({ error: errMessage });
    }

}

//------------------------------------------------

async function handleUserFound(userCredentials, password) {
    const passwordsMatch = await checkPassword(userCredentials, password);

    if (passwordsMatch) {
        const token = generateToken(userCredentials);
        return token;
    }
    else
        throwPasswordErr();
}

function throwUserNotFoundErr() {
    const err = new Error("User Not Found");
    err.name = "UserNotFoundError";
    err.status = 400;
    throw err;
}

async function checkPassword(userCredentials, password) {
    const hashedPass = userCredentials.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPass);

    return passwordsMatch
}


function throwPasswordErr() {
    const err = new Error("Wrong Passsword");
    err.name = "InvalidPasswordError";
    err.status = 401;
    throw err;
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



module.exports = { login, signUp, getCurrentUser };

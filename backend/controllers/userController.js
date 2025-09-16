require('dotenv').config();
const user = require('../models/user')
const utils = require('../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET


function sampleRequest(req, res) {
    console.log("Sample Request");
    res.json({ message: "Sample Request successful" });
}


module.exports = { sampleRequest };
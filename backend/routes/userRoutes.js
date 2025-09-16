const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;
const utils = require('../utils');


//----------------------------------------------------------
//Middleware
//----------------------------------------------------------
userRouter.use(utils.verifyTokenMiddleware);


//-----------------------------------------------------------
//Routes
//----------------------------------------------------------
userRouter.get('/sampleRequest', userController.sampleRequest);


module.exports = userRouter;
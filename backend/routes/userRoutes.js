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
userRouter.use(verifyCustomerRoleMiddleware);


function verifyCustomerRoleMiddleware(req, res, next) {
    const user = req.user
    const role = user.role;

    if (role != "customer") {
        return res.status(403).json({ error: "Access Denied: Customer-Only" });
    }
    next();
}

//-----------------------------------------------------------
//Routes
//----------------------------------------------------------
userRouter.get('/sampleRequest', userController.sampleRequest);
userRouter.get('/getProducts', userController.getProducts);
userRouter.post('/checkoutOrder', userController.checkoutOrder);
userRouter.get('/getOrders', userController.getOrders);
userRouter.get('/getOrderItems/:orderID', userController.getOrderItems);
userRouter.get('/getProfile', userController.getProfile);


module.exports = userRouter;
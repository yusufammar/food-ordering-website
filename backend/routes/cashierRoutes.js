const express = require('express');
const cashierRouter = express.Router();
const cashierController = require('../controllers/cashierController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

const utils = require('../utils');

//----------------------------------------------------------
//Middleware
//----------------------------------------------------------
cashierRouter.use(utils.verifyTokenMiddleware);
cashierRouter.use(verifycashierRoleMiddleware);


function verifycashierRoleMiddleware(req, res, next) {
    const user = req.user
    const role = user.role;

    if (role != "cashier") {
        return res.status(403).json({ error: "Access Denied: cashier-Only" });
    }
    next();
}
//-----------------------------------------------------------
//Routes
//----------------------------------------------------------

cashierRouter.get('/getOrders', cashierController.getOrders);
cashierRouter.get('/getOrderItems/:orderID', cashierController.getOrderItems);
cashierRouter.get('/orderStream', cashierController.orderStream);

module.exports = cashierRouter;








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
cashierRouter.use(verifyCashierRoleMiddleware);


function verifyCashierRoleMiddleware(req, res, next) {
    const user = req.user
    const role = user.role;

    if (role != "cashier") {
        return res.status(403).json({ error: "Access Denied: Cashier-Only" });
    }
    next();
}
//-----------------------------------------------------------
//Routes
//----------------------------------------------------------

cashierRouter.get('/getOrders', cashierController.getOrders);
cashierRouter.get('/getOrderDetails/:orderID/:customerID', cashierController.getOrderDetails);
cashierRouter.get('/orderStream', cashierController.orderStream);
cashierRouter.get('/updateOrderStatus/:orderID/:newStatus', cashierController.updateOrderStatus);



module.exports = cashierRouter;








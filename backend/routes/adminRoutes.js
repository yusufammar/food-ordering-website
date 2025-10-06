const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

const utils = require('../utils');

//----------------------------------------------------------
//Middleware
//----------------------------------------------------------
adminRouter.use(utils.verifyTokenMiddleware);
adminRouter.use(verifyAdminRoleMiddleware);


function verifyAdminRoleMiddleware(req, res, next) {
    const user = req.user
    const role = user.role;

    if (role != "admin") {
        return res.status(403).json({ error: "Access Denied: Admin-Only" });
    }
    next();
}
//-----------------------------------------------------------
//Routes
//----------------------------------------------------------

adminRouter.post('/importProducts', adminController.importProducts);


module.exports = adminRouter;








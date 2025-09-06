const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET

//----------------------------------------------------------
//Middleware
//----------------------------------------------------------
adminRouter.use(verifyTokenMiddleware);
adminRouter.use(verifyRoleMiddleware);

function verifyTokenMiddleware(req, res, next) {
    const token = req.headers.authorization;
    // NOTE: Using `Authorization: <token>` (not `Bearer <token>`) for simplicity.
    // My backend expects the raw token in the `Authorization` header.
    // Can switch to standard Bearer format if integrating with third-party APIs.
    //--------------------------------------------------------------------------

    if (!token) {
        console.log("no token");
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const user = jwt.verify(token, secretKey); // user payload (decoded)- Note: if jwt is invalid, jwt.verify throws an error (caught in catch block)         
        req.user = user; // attach user to request for next middleware
        next();
    }
    catch (err) {
        console.error(err);

        const error = err.name
        if (error == 'TokenExpiredError' || error == 'JsonWebTokenError')
            res.status(401).json({ error });
        else
            res.status(500).json({ error });
    }
}
function verifyRoleMiddleware(req, res, next) {

    const user = req.user
    const role = user.role;

    if (role != "admin") {
        //403: Forbidden
        return res.status(403).json({ error: "Access Denied: Admin-Only" });
    }

    next();
}
//-----------------------------------------------------------
//Routes
//----------------------------------------------------------

adminRouter.post('/importProducts', adminController.importProducts);


module.exports = adminRouter;








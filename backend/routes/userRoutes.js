const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET

//----------------------------------------------------------
//Middleware
//----------------------------------------------------------
userRouter.use(verifyTokenMiddleware);

function verifyTokenMiddleware(req, res, next) {
    const token = req.headers.authorization;
    // NOTE: Using `Authorization: <token>` (not `Bearer <token>`) for simplicity.
    // My backend expects the raw token in the `Authorization` header.
    // Can switch to standard Bearer format if integrating with third-party APIs.
    //--------------------------------------------------------------------------

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        try {
            const user = jwt.verify(token, secretKey); // user payload
            // Note: if jwt is invalid, jwt.verify throws an error (caught in catch block)
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

//-----------------------------------------------------------
//Routes
//----------------------------------------------------------
userRouter.get('/sampleRequest', userController.sampleRequest);


module.exports = userRouter;
const express= require('express');
const authRouter= express.Router();
const authController= require('../controllers/authController');


authRouter.post('/login', authController.login);
authRouter.post('/signUp', authController.signUp);
authRouter.get('/getProducts', authController.getProducts);
authRouter.get('/getSettings', authController.getSettings);

module.exports= authRouter;
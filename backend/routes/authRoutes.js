const express= require('express');
const authRouter= express.Router();
const authController= require('../controllers/authController');


authRouter.post('/login', authController.login);
authRouter.post('/signUp', authController.signUp);
authRouter.post('/getCurrentUser', authController.getCurrentUser);


module.exports= authRouter;
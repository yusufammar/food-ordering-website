const express= require('express');
const adminRouter= express.Router();
const adminController= require('../controllers/adminController');


adminRouter.get('/', adminController.getHomePage);


module.exports= adminRouter;
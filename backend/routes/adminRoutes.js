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
adminRouter.post('/setStoreName', adminController.setStoreName);

//-----------------------------------------
//#Image Upload
//-----------------------------------------
adminRouter.post('/uploadItemsImages', adminController.clearItemsFolderMiddleware,
    adminController.uploadItemsImages, adminController.handleImagesUploadSuccess);
// adminRouter.post('/uploadStoreLogo', adminController.clearLogoFolderMiddleware,
//     adminController.uploadLogoImage, adminController.handleImagesUploadSuccess);
    adminRouter.post('/uploadStoreLogo',
    adminController.uploadLogoImage, adminController.handleLogoUploadSuccess);

//------
// Error Middleware for Image Uploads
adminRouter.use((err, req, res, next) => {
    return res.status(400).json({ error: err.message });

});



module.exports = adminRouter;








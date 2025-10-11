require('dotenv').config();

const pool = require('../config/db.js')

const user = require('../models/user')
const product = require('../models/product')
const settings = require('../models/settings')

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');

const authController = require('../controllers/authController');


async function importProducts(req, res) {
    const { productsArray } = req.body

    const data = [
        { key: "productsArray", value: productsArray, type: "array", trim: 0, required: 1 },

    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition
    //-----------------------------

    try {
        let { productsArray } = transformedData
        await product.insertProducts(productsArray)
        const message = "Import Products Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}

async function setStoreName(req, res) {
    const { storeName } = req.body

    const data = [
        { key: "storeName", value: storeName, type: "string", trim: 1, required: 1 },

    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition
    //-----------------------------

    try {
        let { storeName } = transformedData
        await settings.insertSetting("storeName", storeName)
        const message = "Set Store Name Successful";
        console.log(message);
        return res.json({ message })
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }

}


async function changeAdminPassword(req, res) {
    let { oldPass, newPass } = req.body;

    const data = [
        { key: "oldPass", value: oldPass, type: "password", trim: 0, required: 1 },
        { key: "newPass", value: newPass, type: "password", trim: 0, required: 1 },
    ];

    const [dataValid, errMessage, transformedData] = await utilsInputValidation.validateData(data);


    if (!dataValid)
        return utilsErrorHandling.handleDataInvalid(res, errMessage); // stopping condition

    //---------------------------------

    try {
        const adminEmail = req.user.email;
        let { oldPass, newPass } = transformedData;
        const userCredentials = await user.getUserCredentials(adminEmail);
        const userFound = (userCredentials != null);

        if (userFound) {
            const passwordsMatch = await authController.checkPassword(userCredentials, oldPass);
            if (!passwordsMatch)
                authController.throwPasswordErr();
            else { // change admin password
                await user.updatePassword(adminEmail,newPass);
                const message = "Admin Password Change Successful";
                console.log(message);
                return res.json({ message });
            }

        }
        else
            authController.throwUserNotFoundErr();

    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }
}

//----------------------------
//# Uploads
//----------------------------

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const itemsUploadDir = path.join(__dirname, '../uploads/items');
const logoUploadDir = path.join(__dirname, '../uploads/logo');

// Storage config for menu images
const itemStorage = multer.diskStorage({
    destination: function (req, file, cb) { // uploads folder
        if (!fs.existsSync(itemsUploadDir))
            fs.mkdirSync(itemsUploadDir, { recursive: true });
        cb(null, itemsUploadDir);
    },
    filename: function (req, file, cb) {
        // cb(null, Date.now() + '-' + file.originalname);
        // cb(null, file.originalname);

        //-------------------------------------------------------------
        //Set all to jpg file extension
        const fileName = file.originalname.split(".")[0]; // name without extension
        const newName = `${fileName}.jpg`;

        cb(null, newName); // save exactly as uploaded

        // console.log(file.originalname);
        // console.log(newName);
    }
});

const logoStorage = multer.diskStorage({
    destination: function (req, file, cb) { // uploads folder
        if (!fs.existsSync(logoUploadDir))
            fs.mkdirSync(logoUploadDir, { recursive: true });
        cb(null, logoUploadDir);
    },
    filename: function (req, file, cb) {
        // cb(null, Date.now() + '-' + file.originalname);
        // cb(null, file.originalname);
        //-------------------------------------------------------------
        //Set all to jpg file extension
        const fileName = file.originalname.split(".")[0]; // name without extension
        const newName = `${fileName}.jpg`;
        const newName2 = `newLogo.jpg`;

        cb(null, newName2); // save exactly as uploaded
    }
});

//-----------------------------------------
//# File Filter (accept only images)
//-----------------------------------------
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // accept the file
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
}

//-----------------------------------------
//# Multer Configuration
//-----------------------------------------
const itemsUpload = multer({ // global limits: max uploads for whole app, ones using this variable
    storage: itemStorage,
    fileFilter,
    limits: {
        files: 150,               // max 150 files per upload request
        fileSize: 200 * 1024     // 200 KB per file (sweet spot), 1024 bytes
    }
});

const logoUpload = multer({ // global limits: max uploads for whole app, ones using this variable
    storage: logoStorage,
    fileFilter,
    limits: {
        files: 1,               // max 150 files per upload request
        fileSize: 200 * 1024     // 200 KB per file (sweet spot), 1024 bytes
    }
});


//----------------------

function clearItemsFolderMiddleware(req, res, next) {
    if (fs.existsSync(itemsUploadDir)) {
        fs.readdirSync(itemsUploadDir).forEach(file => {
            fs.unlinkSync(path.join(itemsUploadDir, file));
        });
    }
    next();
}

function clearLogoFolderMiddleware(req, res, next) {
    if (fs.existsSync(logoUploadDir)) {
        fs.readdirSync(logoUploadDir).forEach(file => {
            fs.unlinkSync(path.join(logoUploadDir, file));
        });
    }
    next();
}

// // Middleware for handling multiple image uploads (mutler middleware)
const uploadItemsImages = itemsUpload.array('images');
// //const uploadItemsImages = upload.array('images', 50); 
// // Sent by frontend: formData.append('images', file) -> Add file under key 'images' // 50 is limit for images
const uploadLogoImage = logoUpload.single('image');


// Controller to process uploaded images (on success only) // note: if there an error in mutler midlerware to upload files, it wont reach here, so you cant handle errors here
// must handle errors with error handling middleware (defined in routes)
function handleImagesUploadSuccess(req, res) {
    const message = "Image(s) Upload Successful"
    res.json({ message });

    // Optionally, you can save these URLs to your database linked to a menu item
    // const files = req.files.map(f => ({
    //     filename: f.filename,
    //     url: `/uploads/items/${f.filename}`
    // }));

    // res.json({ files });
};

function handleLogoUploadSuccess(req, res) {

    const oldPath = req.file.path;
    const newName = `logo.jpg`; // your desired final name
    const newPath = path.join(logoUploadDir, newName);


    fs.rename(oldPath, newPath, (err) => {
        let message = "";
        if (err) {
            message = 'Error renaming file';
            return res.status(500).json({ message });
        }

        message = 'Logo uploaded and renamed successfully!';
        res.json({ message });
    });



};



module.exports = { importProducts, setStoreName, changeAdminPassword, uploadItemsImages, uploadLogoImage, handleImagesUploadSuccess, handleLogoUploadSuccess, clearItemsFolderMiddleware, clearLogoFolderMiddleware };

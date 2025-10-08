require('dotenv').config();
const user = require('../models/user')
const product = require('../models/product')
const settings = require('../models/settings')

const utils = require('../utils');
const utilsErrorHandling = require('../utils_errorHandling');
const utilsInputValidation = require('../utils_inputValidation');


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

//----------------------------
//# Uploads
//----------------------------

const path = require('path');
const multer = require('multer');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads/items');

// Storage config for menu images
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // uploads folder
        if (!fs.existsSync(uploadDir))
            fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
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
const upload = multer({ // global limits: max uploads for whole app, ones using this variable
    storage,
    fileFilter,
    limits: {
        files: 150,               // max 150 files per upload request
        fileSize: 200 * 1024     // 200 KB per file (sweet spot), 1024 bytes
    }
});


//----------------------

function clearFolderMiddleware(req, res, next) {
    if (fs.existsSync(uploadDir)) {
        fs.readdirSync(uploadDir).forEach(file => {
            fs.unlinkSync(path.join(uploadDir, file));
        });
    }
    next();
}

// // Middleware for handling multiple image uploads (mutler middleware)
const uploadItemsImages = upload.array('images');
// //const uploadItemsImages = upload.array('images', 50); 
// // Sent by frontend: formData.append('images', file) -> Add file under key 'images' // 50 is limit for images



// Controller to process uploaded images (on success only) // note: if there an error in mutler midlerware to upload files, it wont reach here, so you cant handle errors here
// must handle errors with error handling middleware (defined in routes)
function handleItemsImagesUploadSuccess(req, res) {
    const message = "Images Upload Successful"
    res.json({ message });

    // Optionally, you can save these URLs to your database linked to a menu item
    // const files = req.files.map(f => ({
    //     filename: f.filename,
    //     url: `/uploads/items/${f.filename}`
    // }));

    // res.json({ files });
};



module.exports = { importProducts, setStoreName, uploadItemsImages, handleItemsImagesUploadSuccess, clearFolderMiddleware };

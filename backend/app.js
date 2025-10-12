
require('dotenv').config();

//Frontend & Backend: Same Config
//#MODE-> Possible Values: [production, dev, dev1port ]
//#dev: basic dev mode, frontend and backend running on separate ports
//#dev1port: run frontend and backend from same port: serve frontend build files from express same
const mode = process.env.MODE || "production";

//-------------------------------------------------------------------------
//Import Express & Create Express App
const express = require('express');
const app = express();
const path = require('path');


//Built In Middleware
const cors = require('cors');
app.use(express.json());
app.use(cors());

//Routers
// Note: Add the "/api" prefix to backend routes to differentiate REST API routes (of the Express app) from frontend routes.
// This is useful if, later on, the frontend is served as static files from the backend server.

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const cashierRouter = require('./routes/cashierRoutes');




app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/cashier', cashierRouter);

// Serve Products images
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));
// Serve Logo Image
app.use('/uploads/logo', express.static(path.join(__dirname, 'uploads/logo')));


app.get('/favicon.ico', (req, res) => res.status(204).end());

if (mode == "dev1port" || mode == "production") {
    //--------------------------------
    // #React - Serve static files from React build
    // --------------------------------------------
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    // app.use(express.static(path.join(__dirname, "dist")));

    // SPA fallback for React (only handles GET requests)
    app.get("*", handleReactRouting); // app.get("*") → catch-all for GET requests only, used for SPA routing.
}


//------------------------------------------
//#Helper Methods
//------------------------------------------

function handleReactRouting(req, res) {
    // Only serve index.html for non-API / non-upload routes
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
        //  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
}

// function handleReactRouting(req, res, next) {
//     console.log("Request path:", req.path);
//     // Only serve index.html for non-API / non-upload routes
//     if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
//         res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//     } 
//     else 
//         next(); // pass other requests (e.g., API routes) to their handlers

// }
//-----------------------------------------------------


module.exports = app;



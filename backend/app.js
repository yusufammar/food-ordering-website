//Import Express & Create Express App
const express= require('express');
const app= express();


//Built In Middleware
const cors= require('cors');
app.use(express.json());
app.use(cors());

//Routers
// Note: Add the "/api" prefix to backend routes to differentiate REST API routes (of the Express app) from frontend routes.
// This is useful if, later on, the frontend is served as static files from the backend server.
const adminRouter= require(`./routes/adminRoutes`)
app.use('/api/admin',adminRouter);


module.exports = app;



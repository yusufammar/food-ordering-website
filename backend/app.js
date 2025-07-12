//Import Express & Create Express App
const express= require('express');
const app= express();

//Built In Middleware
app.use(express.json());

//Routers
const adminRouter= require(`./routes/adminRoutes`)
app.use('/admin',adminRouter);


module.exports = app;



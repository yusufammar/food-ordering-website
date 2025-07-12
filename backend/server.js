const app= require("./app");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

function serverStartCallback(){
    console.log(`Server Running at ${PORT}`);
}

//Start Server at given port
app.listen(PORT,serverStartCallback);
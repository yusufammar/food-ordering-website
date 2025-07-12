
function getHomePage(req,res){
    res.send("Home Page");
    console.log("Home Page - Console");
} 

module.exports = {getHomePage};
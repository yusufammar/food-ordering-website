
function getHomePage(req,res){
    res.send("Sent From Server: Home Page ");
    console.log("Server Console: HomePage");
} 

module.exports = {getHomePage};
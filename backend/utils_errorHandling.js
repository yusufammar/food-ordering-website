// Error Status Codes:
// 4xx = client error, 5xx = server errors
// 400 = wrong input (incomplete req body)
// 401 = unauthorized (wrong email/password, missing / invalid /expired token )
// 403 = forbidden (acess denied, wrong role)
// 409 = conflict (email already exists)
//-----------------------------------------------------------------------

function handleNoToken(res) {
    console.error("no token");
    return res.status(401).json({ error: 'No token provided' });
}

function handleDataInvalid(res, errMessage) {
    console.error(errMessage);
    return res.status(400).json({ error: errMessage });
}


function handleError(err, res) {
    // console.error(err);
    let errStatus = err.status || 500;


    if (err.name == "TokenExpiredError" || err.name == "JsonWebTokenError") {
        errStatus = 401;
    }

    if (err.detail != null && err.detail.includes("already exists")) {
        errStatus = 409;
    }

    let errMsg = `Error ${errStatus} (${err.name || "Internal Server Error"}): ${err.detail || err.message || "Network Error"}`;
    return res.status(errStatus).json({ error: errMsg });
}

module.exports = { handleNoToken, handleDataInvalid, handleError }

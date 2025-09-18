
const utilsErrorHandling= require('./utils_errorHandling');

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET
// function verifyTokenMiddleWare() Documentation:-
// NOTE: Using `Authorization: <token>` (not `Bearer <token>`) for simplicity.
// My backend expects the raw token in the `Authorization` header.
// Can switch to standard Bearer format if integrating with third-party APIs.
//--------------------------------------------------------------------------

function verifyTokenMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token)
        return utilsErrorHandling.handleNoToken(res);

    try {
        const user = jwt.verify(token, secretKey); // user payload (decoded)- Note: if jwt is invalid, jwt.verify throws an error (caught in catch block)         
        req.user = user; // attach user to request for next middleware
        next();
    }
    catch (err) {
        utilsErrorHandling.handleError(err, res);
    }
}


// prepareMultipleInsert()
// Objective: Build the values array + placeholders string so we can plug them into  an SQL query to insert multiple rows at once.
// Input: array of objects (dataArray), list of columns (columnsNeeded).
// Builds:
//   1. a flat array of all the values (valuesArray)
//   2. a string of SQL placeholders like "($1,$2),($3,$4)" (placeholdersString)
function prepareMultipleInsert(dataArray, columnsNeeded) {


    let valuesArray = [];
    let placeholdersArray = [];
    let placeHolderCounter = 1;

    for (let dataRow of dataArray) {

        let insertRow = [];
        let placeholderRow = [];


        // For each column in this data row:
        // - Add the actual value to `insertRow`
        // - Add a positional placeholder ($1, $2, …) to `placeholderRow`
        // - Increment the counter for the next placeholder
        for (let column of columnsNeeded) {
            insertRow.push(dataRow[column])
            placeholderRow.push(`$${placeHolderCounter}`);
            placeHolderCounter++;
        }

        valuesArray.push(insertRow);
        placeholdersArray.push(placeholderRow);

    }


    valuesArray = valuesArray.flat();
    let placeholdersString = buildPlaceholdersString(placeholdersArray);

    return { valuesArray, placeholdersString };
}



function buildPlaceholdersString(placeholdersArray) {
    //Input(Array): [  [ '$1', '$2', '$3', '$4' ],  [ '$5', '$6', '$7', '$8' ]     ]
    //Output(String): '($1,$2,$3,$4),($5,$6,$7,$8)'


    //Step 1: join each single row into 1 string
    //Input (single row):  [ '$1', '$2', '$3', '$4' ]
    //Output:                   '($1,$2,$3,$4)'
    let placeholderString = placeholdersArray.map(row => {
        rowString = `(${row.join(",")})`;
        return rowString;
    }
    );

    //Step 2: join all rows into 1 string (array turned to string removes braces)
    placeholderString = placeholderString.join(',');


    return placeholderString;

    //--------------------------------------
    //Approach 2: using JSON stringify
    //--------------------------------------

    // let phString=JSON.stringify(placeholdersArray);
    // phString= phString.slice(1,phString.length-1)
    // phString= phString.replaceAll("[","(");
    // phString= phString.replaceAll("]",")");
    // phString= phString.replaceAll('"','');

}



module.exports = { verifyTokenMiddleware, prepareMultipleInsert };

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


//-------------------------------------------
// Input Validation
//-----------------------------------------
function validateAuthData(data) {  // for things that have email & password --> sign in & sign up

    const [requiredFieldsAvailable, missingFields, transformedData] = checkAndTransformRequiredFields(data);

    let errMessage = "";
    let dataValid = true;

    if (!requiredFieldsAvailable) {
        errMessage = "Please Complete Missing Fields: " + missingFields.toString();
        dataValid = false;
    }

    //If required fields valid go to next step -->  Check Inputs (specific schecks)
    else if (requiredFieldsAvailable) {

        const [inputsValid, errList] = checkAuthInputs(transformedData);

        if (!inputsValid) {
            errMessage = constructErrMessage(errList);
            dataValid = false;
        }

    }
    return [dataValid, errMessage, transformedData]


}


function checkAndTransformRequiredFields(data) {
    let requiredFieldsAvailable = true;
    let missingFields = [];
    let transformedData = {};

    for (let fieldObject of data) {

        const fieldName = Object.keys(fieldObject)[0];
        let fieldValue = fieldObject[fieldName];
        const trim = fieldObject.trim;
        const required = fieldObject.required;


        //1- Trim First
        if (trim == 1)
            fieldValue = fieldValue.trim();

        //2- Chceck If Not Empty (if Required)
        if (required == 1 && (fieldValue == "" || fieldValue == null)) {
            requiredFieldsValid = false;
            missingFields.push(fieldName);
        }

        transformedData[fieldName] = fieldValue;


    }
    return [requiredFieldsAvailable, missingFields, transformedData];
}


function checkRequiredFields(data) {
    let errMessage = null;
    let requiredFieldsAvailable = true;
    let missingFields = [];


    for (let fieldObject of data) {

        const fieldName = Object.keys(fieldObject)[0];
        let fieldValue = fieldObject[fieldName];

        const required = fieldObject.required;


        //2- Chceck If Not Empty (if Required)
        if (required == 1 && (fieldValue == "" || fieldValue == null)) {
            requiredFieldsAvailable = false;
            missingFields.push(fieldName);
        }
    }


    if (!requiredFieldsAvailable) {
        errMessage = "Please Complete Missing Fields: " + missingFields.toString();
    }

    return [requiredFieldsAvailable, missingFields, errMessage];
}

function checkAuthInputs(data) {
    let errList = [];
    let valid = true;


    //check email
    const emailInput = data.email;
    const emailErr = checkEmailInput(emailInput);
    if (emailErr) errList.push(emailErr);


    //check password
    const passwordInput = data.password;
    const passwordErr = checkPasswordInput(passwordInput);
    if (passwordErr) errList.push(passwordErr);

    //-----------------------------------------------       

    if (errList.length > 0)
        valid = false;


    return [valid, errList];
}

//--------------------------------------
//Helper Methods
//--------------------------------------

function checkEmailInput(input) {
    let errObj = {};
    if (input != "admin" && (!input.includes("@") || !input.includes(".com"))) {
        errObj.email = "* Invalid Email: Please Enter a Valid Email";
        return errObj;
    }
    else
        return null;
}

function checkPasswordInput(input) {
    let errObj = {};

    if (input.length < 4) {
        errObj.password = "* Short Password: Please Enter Password Longer than 4 characters";
        return errObj;
    }
    else
        return null;
}

function constructErrMessage(errList) {
    let fullMsg = "";
    for (let i = 0; i < errList.length; i++) {
        const errObj = errList[i];
        const errKey = Object.keys(errObj)[0];
        const errMsg = errObj[errKey];
        fullMsg += errMsg + " \n";
    }
    return fullMsg;
}

module.exports = { validateAuthData, checkRequiredFields, prepareMultipleInsert }

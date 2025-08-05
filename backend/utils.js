//-------------------------------------------
// Input Validation
//-----------------------------------------
function validateData(data) {

    const [requiredFieldsValid, missingFields, transformedData] = checkRequiredFields(data);

    let errMessage = "";
    let dataValid = true;

    if (!requiredFieldsValid) {
        errMessage = "Please Complete Missing Fields: " + missingFields.toString();
        dataValid = false;
    }

    //If required fields valid go to next step -->  Check Inputs (specific schecks)
    else if (requiredFieldsValid) {

        const [inputsValid, errList] = checkInputs(transformedData);

        if (!inputsValid) {
            errMessage = constructErrMessage(errList);
            dataValid = false;
        }

    }
    return [dataValid, errMessage, transformedData]


}


function checkRequiredFields(data) {
    let requiredFieldsValid = true;
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
    return [requiredFieldsValid, missingFields, transformedData];
}

function checkInputs(transformedData) {
    let errList = [];
    let valid = true;


    //check email
    const emailInput = transformedData.email;
    const emailErr = checkEmailInput(emailInput);
    if (emailErr) errList.push(emailErr);


    //check password
    const passwordInput = transformedData.password;
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
    if (!input.includes("@") || !input.includes(".com")) {
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

module.exports={validateData}

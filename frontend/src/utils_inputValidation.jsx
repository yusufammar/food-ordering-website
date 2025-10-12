import * as XLSX from 'xlsx';


// (Input ) Data Matrix
//  const data = [
//             {key: "email", value: email, type: "email", trim: 1, required: 1 },
//             {key: "password", value: password, type: "password", trim: 0, required: 1 },
//         ];

async function validateData(data) {
  let errMessage = "";
  let dataValid = true;


  const [requiredFieldsValid, missingFields, newData] = checkRequiredFields(data);



  if (!requiredFieldsValid) { // stopping condition
    dataValid = false;
    errMessage = constructRequiredFieldsErrMessage(missingFields);
    return [dataValid, errMessage];
  }
  //---------------------------------------------------

  //If required fields valid go to next step -->  Check Inputs (specific schecks)

  let [inputsValid, errList, transformedData] = await checkInputs(newData);

  if (!inputsValid) {
    dataValid = false;
    errMessage = constructErrMessage(errList);
    transformedData = null;
  }


  return [dataValid, errMessage, transformedData];

}

function checkRequiredFields(data) {
  let requiredFieldsAvailable = true;
  let missingFields = [];
  // let transformedData = {};

  for (let fieldObject of data) {

    const fieldName = fieldObject.key;
    let fieldValue = fieldObject.value;
    const trim = fieldObject.trim;
    const required = fieldObject.required;


    //1- Trim First (with null check)
    // Reason 1: Eliminate space to check if string is meaningful before deciding if its is valid
    // Reason 2 (Null Check): Need to null check becuase you can't trim an undefined / null value. 
    // Note: undefined (val) == null (val) -> loosely equal ,but not strictly equal undefined (val) === null (val) 
    if (trim == 1 && fieldValue != null) {
      fieldValue = fieldValue.trim();
    }

    //2- Check If Not Empty ( & if Required)
    if ((required == 1) && (fieldValue == null || fieldValue == "")) {
      requiredFieldsAvailable = false;
      missingFields.push(fieldName);
    }

    //*update data object
    fieldObject.value = fieldValue;
    // transformedData[fieldName] = fieldValue;

  }

  // console.log(data);
  return [requiredFieldsAvailable, missingFields, data];
}


async function checkInputs(data) {
  let errList = [];
  let valid = true;
  let transformedData = {};

  for (let fieldObject of data) {

    const fieldName = fieldObject.key;
    let fieldValue = fieldObject.value;
    const fieldType = fieldObject.type;


    switch (fieldType) {

      case ("email"): {
        const emailErr = checkEmailInput(fieldValue);
        if (emailErr) errList.push(emailErr);
      } break;

      case ("password"): {
        const passwordErr = checkPasswordInput(fieldValue);
        if (passwordErr) errList.push(passwordErr);
      } break;

      case ("phone_no"): {
        const phoneNoErr = checkPhoneNoInput(fieldValue);
        if (phoneNoErr) errList.push(phoneNoErr);
      } break;

      case ("excelFile"): { // Note: Field Value here is file, we will convert to prodduct array before sending to backend 
        //Note: data matrix wont be sent so type wont be sent, just need to update value)

        const fileErr = checkFileInput(fieldValue);
        if (fileErr) errList.push(fileErr);
        else {
          let productsArray = await readExcelFile(fieldValue);
          fieldValue = productsArray;
          //*update data object
          fieldObject.value = fieldValue;
        }
      } break;
    }

    transformedData[fieldName] = fieldValue;
  }

  //-----------------------------------------------       

  if (errList.length > 0)
    valid = false;

  return [valid, errList, transformedData];
}

function checkEmailInput(input) {
  let errObj = {};

  if (input == "admin" || input == "cashier")
    return null;

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

function checkPhoneNoInput(input) {
  let errObj = {};

  return null;

  // if (input.length != 11) {
  //   errObj.password = "* Invalid Phone No";
  //   return errObj;
  // }
  // else
  //   return null;
}

function checkFileInput(file) {
  let errObj = {};

  let fileValid = false;
  let errMessage = "";

  if (file) {
    let fileType = file.name.split(".")[1];
    if (fileType == "xlsx" || fileType == "csv") {
      fileValid = true;

    }
    else {
      fileValid = false;
      errMessage = "Wrong File Type: Please Upload an excel file (.xlsx or .csv)";
    }
  }
  else {
    fileValid = false;
    errMessage = "No file selected";

  }

  //--------------------
  if (fileValid) {
    return null;
  }
  else
    errObj.file = errMessage;
  return errObj;

  // return [fileValid, errMessage];
}


async function readExcelFile(file) {

  //Step 0: read binary
  const data = await file.arrayBuffer();

  // Step 1: Parse Excel binary into workbook object
  const workbook = XLSX.read(data, { type: 'array' });

  // Step 2: Access first sheet (Sheet 1)
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Step 3: Convert sheet 1 data to JSON
  const sheet_json = XLSX.utils.sheet_to_json(sheet);
  // console.log(sheet_json); // Parsed rows from Excel Sheet 1

  return sheet_json;
}
//--------------------------------
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

function constructRequiredFieldsErrMessage(missingFields) {
  let errMessage = "Please Complete Missing Fields: " + missingFields.toString();
  return errMessage;
}





export { validateData };

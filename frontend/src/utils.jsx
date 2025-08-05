import App from './App';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function getSavedUser() {
  const user = {
    id: localStorage.getItem('id'),
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    token: localStorage.getItem('token')
  }
  return user;
}

function setUser(token) {
  setToken(token);
  const payload = decodeToken(token);
  // console.log(payload);
  savePayload(payload);
}

function unsetUser(token) {
  localStorage.clear();
  // unsetToken();
  // deletePayload();
}

//----------------------------------------

function setToken(token) {
  localStorage.setItem('token', token);
}

function getToken() {
  const token = localStorage.getItem('token');
  // console.log(token);
  return (token);
}

function decodeToken(token) {
  const payload = jwtDecode(token);
  return payload;
}

function unsetToken() {
  localStorage.removeItem('token');
  //Note:If the given key does not exist, removeItem() does nothing.
}

//-----------------------------------------------------------------------------------

function savePayload(payload) {
  const id = payload.id;
  const name = payload.name;
  const email = payload.email;
  const role = payload.role;

  localStorage.setItem('id', id);
  localStorage.setItem('name', name);
  localStorage.setItem('email', email);
  localStorage.setItem('role', role);
}


function deletePayload() {
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
}

//-------------------------------------------
// Input Validation
//--------------------------------------------

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


//-------------------------------------------
//##Review

function getCurrentUser() {
  const token = getToken();

  if (token != null) {
    const data = { token };
    axios.post(App.baseUrl + "/getCurrentUser", data)
      .then(res => console.log(res.data))
      .catch(err => {

        const error = err.response.data.error;
        console.log(error);

        unsetToken();
        window.location.reload();



        // if (error=='TokenExpiredError'){
        //   console.log(error)
        unsetToken();
        window.location.reload();
        // }

      }

      );
  }

  else {
    console.log("No User Logged In");
  }


}

export { getSavedUser, setUser, unsetUser, getToken, setToken, unsetToken, validateData, getCurrentUser };

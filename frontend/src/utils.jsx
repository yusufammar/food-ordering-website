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

function unsetUser() {
  unsetToken();
  deletePayload();
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
  localStorage.removeItem('role');
}

function setCart(cart) {
  let cartJSON= JSON.stringify([...cart]);
  localStorage.setItem('cartJSON', cartJSON);
}

function getCart() {
  const cartJSON = localStorage.getItem('cartJSON');
  let cartArray= JSON.parse(cartJSON);
  // console.log(token);
  return (cartArray);
}
function unsetCart() {
  localStorage.removeItem('cartJSON');
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

export {
  getSavedUser, setUser, unsetUser, getToken, setToken, unsetToken, getCart, setCart, unsetCart,
  // validateData, 
  getCurrentUser
};

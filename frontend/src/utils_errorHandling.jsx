// Error Status Codes:
// 4xx = client error, 5xx = server errors
// 400 = wrong input (incomplete req body)
// 401 = unauthorized (wrong email/password, missing / invalid /expired token )
// 403 = forbidden (acess denied, wrong role)
// 409 = conflict (email already exists)
//-----------------------------------------------------------------------


function handleSuccessStandard(res) {
  const { message } = res.data;
  alert(message);
}


function handleFailureStandard(err) {

  const error = err.response.data.error;
  console.log(err.status);

  switch (err.status) {
    case (400): alert(error); break; // Client Error (Wrong Input)
    case (401 || 403 || 409): alert(error); logout(); break; // Client Error: Forbiden / wrong email,pass
    default: alert(error); break; // Server Error (500)
  }

}

function handleDataInvalid(errMessage) {
  alert(errMessage);

}

function logout() {
  utils.unsetUser();
  window.location.reload();
}

export { logout, handleFailureStandard, handleSuccessStandard, handleDataInvalid };

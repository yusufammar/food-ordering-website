import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import * as utils from "./utils";
import * as utilsErrorHandling from './utils_errorHandling';

import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AdminHome from './components/Admin/AdminHome';
import AdminImportProducts from './components/Admin/Admin_ImportProducts';
import CustomerHome from './components/Customer/CustomerHome';
import CustomerOrderHistory from './components/Customer/Customer_OrderHistory';
import CustomerOrderDetails from './components/Customer/Customer_OrderDetails';
import CustomerProfile from './components/Customer/Customer_Profile';
import CashierOrders from './components/Cashier/Cashier_Orders';
import CashierOrderDetails from './components/Cashier/Cashier_OrderDetails';
import AdminSetStoreName from './components/Admin/Admin_UploadItemsImages';
import AdminUploadItemsImages from './components/Admin/Admin_UploadItemsImages';
import AdminUploadStoreLogo from './components/Admin/Admin_UploadStoreLogo';

function App() {

  const productionMode = true;

  //---------------------------------------------------
  const developmentBackendBaseUrl = "http://localhost:5000/api"
  const productionBackendBaseUrl = "https://oh-crepe.onrender.com/api"
  
  App.baseUrl = productionMode ? productionBackendBaseUrl : developmentBackendBaseUrl
  App.baseImageUrl = `${App.baseUrl.slice(0, -4)}/uploads/items`; // remove "/api" from baseUrl
  App.logoUrl = `${App.baseUrl.slice(0, -4)}/uploads/logo/logo.jpg`; // remove "/api" from baseUrl
  App.defaultLogoUrl = `${App.baseUrl.slice(0, -4)}/uploads/logo/defaultLogo.jpg`; // remove "/api" from baseUrl
  //---------------------------------------------------
  const settings = utils.getSettings(); // this needs to be here so title and icon is available for all pages, when they refresh
  const appName = settings.storeName;

  useEffect(updateTabTitle, []);

  function updateTabTitle() {
  document.title = appName;
  setFavicon(App.logoUrl);

  // const customIcon = App.logoUrl;      
  // const fallbackIcon = App.defaultLogoUrl;        
  // const img = new Image();
  
  // //***Causes Problems in Production
  // img.src = customIcon;
  // img.onload = () => { setFavicon(customIcon); };
  // img.onerror = () => {  setFavicon(fallbackIcon); };
}

function setFavicon(url) { // icon should be always there, prevent logo upload if unseccusful
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);
}



  //------------------------------------------
  // useEffect(getSettings, []) // if I do it here on any page refresh this will be called, which is a bit overkill, i dont need to frequently update that much

  // function getSettings() {
  //   console.log("Mounted");

  //   axios.get(App.baseUrl + "/getSettings")
  //     .then(res => handleSuccess(res))
  //     .catch(err => utilsErrorHandling.handleFailureStandard(err, navigate));

  // }
  // //-------------------------------------------------------
  // //Helper Methods
  // //-------------------------------------------------------

  // function handleSuccess(res) {
  //   utils.setSettings(res.data.settings);
  //   // console.log(res.data.settings)
  // }



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/customerHome" element={<CustomerHome />} />
        <Route path="/adminImportProducts" element={<AdminImportProducts />} />
        <Route path="/adminSetStoreName" element={<AdminSetStoreName />} />
        <Route path="/adminUploadItemsImages" element={<AdminUploadItemsImages />} />
        <Route path="/adminUploadStoreLogo" element={<AdminUploadStoreLogo />} />
        <Route path="/customerOrderHistory" element={<CustomerOrderHistory />} />
        <Route path="/customerOrderDetails" element={<CustomerOrderDetails />} />
        <Route path="/customerProfile" element={<CustomerProfile />} />
        <Route path="/cashierOrders" element={<CashierOrders />} />
        <Route path="/cashierOrderDetails" element={<CashierOrderDetails />} />
      </Routes>

    </Router>
  );

}

export default App;
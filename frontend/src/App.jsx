import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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

function App(){
  const developmentBackendBaseUrl= "http://localhost:5000/api"
  const productionBackendBaseUrl= "https://food-ordering-website-0fhj.onrender.com/api"
 
  App.baseUrl= productionBackendBaseUrl;

  return(
    <Router>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/login"  element={<Login/>} />
        <Route path="/signUp"  element={<SignUp/>} />
        <Route path="/adminHome"  element={<AdminHome/>} />
        <Route path="/customerHome"  element={<CustomerHome/>} />
        <Route path="/adminImportProducts"  element={<AdminImportProducts/>} />
        <Route path="/customerOrderHistory"  element={<CustomerOrderHistory/>} />
        <Route path="/customerOrderDetails"  element={<CustomerOrderDetails/>} />
        <Route path="/customerProfile"  element={<CustomerProfile/>} />
        <Route path="/cashierOrders"  element={<CashierOrders/>} />
        <Route path="/cashierOrderDetails"  element={<CashierOrderDetails/>} />
      </Routes>

    </Router>
  );

}

export default App;
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

function App(){
  
  App.baseUrl= "http://localhost:5000/api";  

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
      </Routes>

    </Router>
  );

}

export default App;
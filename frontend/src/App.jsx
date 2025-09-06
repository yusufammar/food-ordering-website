import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import AdminHome from './components/AdminHome';
import AdminImportProducts from './components/Admin_ImportProducts';

function App(){
  
  App.baseUrl= "http://localhost:5000/api";  

  return(
    <Router>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/login"  element={<Login/>} />
        <Route path="/signUp"  element={<SignUp/>} />
        <Route path="/adminHome"  element={<AdminHome/>} />
         <Route path="/adminImportProducts"  element={<AdminImportProducts/>} />
      </Routes>

    </Router>
  );

}

export default App;
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App(){
  
  App.baseUrl= "http://localhost:5000/api";  

  return(
    <Router>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/login"  element={<Login/>} />
        <Route path="/signUp"  element={<SignUp/>} />
      </Routes>

    </Router>
  );

}

export default App;
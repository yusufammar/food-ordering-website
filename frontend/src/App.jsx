import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/home';
import About from './components/about';

function App(){
  
  App.baseUrl= "http://localhost:5000/api";  

  return(
    <Router>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/about" element={<About/>}/>
      </Routes>

    </Router>
  );

}

export default App;
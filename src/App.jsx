import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>}></Route>
            <Route path="signup" element={<Signup/>} ></Route>
            <Route path="dashboard" element={<Dashboard/>} ></Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;

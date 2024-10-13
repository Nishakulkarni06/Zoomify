import './App.css';
import LandingPage from './pages/landing';
import AuthenticationPage from './pages/authentication';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/auth" element={<AuthenticationPage></AuthenticationPage>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

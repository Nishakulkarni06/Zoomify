import './App.css';
import LandingPage from './pages/landing';
import AuthenticationPage from './pages/authentication';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';

function App() {
  return (
    <div className="App">
      <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/auth" element={<AuthenticationPage></AuthenticationPage>}></Route>
          <Route path='/:url' element={<VideoMeet></VideoMeet>}></Route>
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

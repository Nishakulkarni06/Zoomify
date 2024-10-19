import './App.css';
import LandingPage from './pages/landing';
import AuthenticationPage from './pages/authentication';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';
import HomeComp  from './pages/HomeComp';
import History from './pages/history';

function App() {
  return (
    <div className="App">
      <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage></LandingPage>}></Route>
          <Route path="/auth" element={<AuthenticationPage></AuthenticationPage>}></Route>
          <Route path='/history' element={<History></History>}></Route>
          <Route path='/home' element={<HomeComp/>}></Route>
          <Route path='/:url' element={<VideoMeet></VideoMeet>}></Route>
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Landingpage from './pages/Landingpage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DiagnosticDashboard from './pages/DiagnosticDashboard';
import Registerform from './pages/Register';
import ProfileEdit from './components/ProfileEdit';
import UploadFile from './pages/Uploadfile';
import UserFileBoard from './pages/Userfileboard';
import Diagnosticupload from './pages/diagnosticupload';
import Requestaccess from './pages/Requestaccess';

function App() {
  const role = localStorage.getItem('role');

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Registerform />} />
        
        {/* Redirect old login paths to unified login */}
        <Route path="/UserLogin" element={<Navigate to="/login" />} />
        <Route path="/Doctorlogin" element={<Navigate to="/login" />} />
        <Route path="/Diagnosticlogin" element={<Navigate to="/login" />} />
        <Route path="/UserLogininner" element={<Navigate to="/login" />} />

        {/* Dashboard Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/diagnostic/dashboard" element={<DiagnosticDashboard />} />
        
        {/* Other Feature Routes */}
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/user/uploads" element={<UploadFile />} />
        <Route path="/user/files" element={<UserFileBoard />} />
        <Route path="/diagnostic/upload" element={<Diagnosticupload />} />
        <Route path="/Requestaccess" element={<Requestaccess />} />
      </Routes>
    </>
  );
}

export default App;

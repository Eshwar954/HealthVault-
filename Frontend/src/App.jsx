import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Landingpage from './pages/Landingpage';
import UserLogin from './pages/UserLogin';
import UserLoginInner from './pages/userlogininner';
import UserDashboard from './pages/UserDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DiagnosticDashboard from './pages/DiagnosticDashboard';
import Registerform from './pages/Register';
import ProfileEdit from './components/ProfileEdit';
import UploadFile from './pages/Uploadfile';
import UserFileBoard from './pages/Userfileboard';
import Diagnosticupload from './pages/diagnosticupload';
import Doctorlogin from './pages/Doctorlogin';
import Diagnosticlogin from './pages/Diagnosticlogin';
import Requestaccess from './pages/Requestaccess';

function App() {
  const role = localStorage.getItem('role'); // Get stored role

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/UserLogininner" element={<UserLoginInner/>} />
        <Route path="/register" element={<Registerform />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/user/uploads" element={<UploadFile />} />
        <Route path="/user/files" element={<UserFileBoard></UserFileBoard>} />
        <Route path="/diagnostic/upload" element={<Diagnosticupload></Diagnosticupload>} />
        <Route path="/Doctorlogin" element={<Doctorlogin />} />
        <Route path="/DiagnosticDashboard" element={<DiagnosticDashboard />} />
        <Route path="/Diagnosticlogin" element={<Diagnosticlogin />} />
        <Route path="/Requestaccess" element={<Requestaccess/>} />


        {/* Role-Based Protected Routes */}
        <Route path="/user/dashboard" element={role === 'user' ? <UserDashboard /> : <Navigate to="/UserLogin" />} />
        <Route path="/doctor/dashboard" element={role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/UserLogin" />} />
        <Route path="/diagnostic/dashboard" element={role === 'diagnostic center' ? <DiagnosticDashboard /> : <Navigate to="/UserLogin" />} />
        
      </Routes>
    </>
  );
}

export default App;

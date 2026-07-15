import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import "./styles/system.css";
import Landingpage from "./pages/Landingpage";
import LoginPage from "./pages/LoginPage";
import Registerform from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import DiagnosticDashboard from "./pages/DiagnosticDashboard";
import UploadFile from "./pages/Uploadfile";
import UserFileBoard from "./pages/Userfileboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatientRecords from "./pages/DoctorPatientRecords";
import DiagnosticOrders from "./pages/DiagnosticOrders";
import AccessHistory from "./pages/AccessHistory";

function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Registerform />} />

        <Route path="/UserLogin" element={<Navigate to="/login" />} />
        <Route path="/Doctorlogin" element={<Navigate to="/login" />} />
        <Route path="/Diagnosticlogin" element={<Navigate to="/login" />} />
        <Route path="/UserLogininner" element={<Navigate to="/login" />} />
        <Route path="/requestaccess" element={<Navigate to="/doctor/appointments" />} />
        <Route path="/Requestaccess" element={<Navigate to="/doctor/appointments" />} />
        <Route path="/diagnostic/upload" element={<Navigate to="/diagnostic/orders" />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/uploads"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UploadFile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/files"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserFileBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/appointments"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/access-history"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <AccessHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments/:appointmentId/records"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatientRecords />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic/dashboard"
          element={
            <ProtectedRoute allowedRoles={["diagnostic center"]}>
              <DiagnosticDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diagnostic/orders"
          element={
            <ProtectedRoute allowedRoles={["diagnostic center"]}>
              <DiagnosticOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

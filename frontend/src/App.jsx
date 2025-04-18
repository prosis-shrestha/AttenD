import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Registration from './pages/Registration';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import StallRegistration from './pages/StallRegistration';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/registration"
        element={
          <ProtectedRoute>
            <Registration />
          </ProtectedRoute>
        }
      />
      <Route
        path="/stall-registration"
        element={
          <ProtectedRoute>
            <StallRegistration />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
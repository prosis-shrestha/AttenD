import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = () => {
        const token = sessionStorage.getItem('adminToken');
        const expiry = sessionStorage.getItem('adminTokenExpiry');

        // Check if token exists and hasn't expired
        if (!token || !expiry) return false;

        // Check if token is valid and not expired
        return token === `${import.meta.env.VITE_ADMIN_CODE}` && Date.now() < parseInt(expiry);
    };

    if (!isAuthenticated()) {
        // Clear any invalid session data
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminTokenExpiry');
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default ProtectedRoute; 
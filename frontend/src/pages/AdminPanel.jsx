import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminTokenExpiry');
        navigate("/admin-login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-800 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-sm"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow text-white">
                        <h2 className="text-xl font-semibold mb-4">Stall Management</h2>
                        <button
                            onClick={() => navigate("/stall-registration")}
                            className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-sm"
                        >
                            Register New Stall
                        </button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow text-white">
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <button
                            onClick={() => navigate("/registration")}
                            className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-sm"
                        >
                            Register New User
                        </button>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow text-white">
                        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded backdrop-blur-sm"
                        >
                            View Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel; 
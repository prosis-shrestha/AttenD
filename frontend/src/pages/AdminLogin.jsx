import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");


        try {
            // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, 
            const response = await axios.post(`/api/auth/admin-login`,
                {
                    code: code
                });

            if (response.data.success) {
                sessionStorage.setItem('adminToken', '8888');
                sessionStorage.setItem('adminTokenExpiry', Date.now() + (24 * 60 * 60 * 1000));
                navigate('/admin-panel');
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            // console.log(`${import.meta.env.VITE_API_URL}`)
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-800 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md text-white">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold">
                        Admin Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="code" className="sr-only">
                                Admin Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="password"
                                required
                                className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/50"
                                placeholder="Enter admin code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-300 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-white/20 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
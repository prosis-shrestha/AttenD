import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [number, setNumber] = useState("");
    const [gender, setGender] = useState("");
    const [code, setCode] = useState(null);
    const [userData, setUserData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegi = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const generatedCode = Math.floor(10000 + Math.random() * 90000);
        setCode(generatedCode);

        const newUser = {
            username,
            number,
            gender,
            code: generatedCode,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/add-users`, newUser);
            setUserData([...userData, response.data]);
        } catch (err) {
            console.error("Error during registration:", err.message);
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-800 flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-sm rounded-lg shadow-md text-white">
                <div className="flex flex-col items-center">
                    <img src="/logo.png" alt="AttenD Logo" className="w-28 mb-4" />
                    <h2 className="text-center text-3xl font-extrabold">
                        User Registration
                    </h2>
                </div>

                {code ? (
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold">Registration Successful!</h3>
                        <div className="text-4xl font-bold bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                            {code}
                        </div>
                        <p className="text-sm mb-6">Please save this code carefully. You'll need it to access your account.</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/admin-panel')}
                                className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm"
                            >
                                Go to Admin Panel
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm"
                            >
                                Go to Homepage
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleRegi} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="mt-1 py-2 px-4 block w-full rounded-md border-white/20 bg-white/5 shadow-sm focus:border-white focus:ring-white text-white placeholder-white/50"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">
                                    Number
                                </label>
                                <input
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="mt-1 py-2 px-4 block w-full rounded-md border-white/20 bg-white/5 shadow-sm focus:border-white focus:ring-white text-white placeholder-white/50"
                                    placeholder="Enter your number"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Gender
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={gender === "Male"}
                                            className="size-4"
                                            required
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <span>Male</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={gender === "Female"}
                                            className="size-4"
                                            required
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <span>Female</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-300 text-sm text-center">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Registration;
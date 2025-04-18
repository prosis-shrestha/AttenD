import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StallRegistration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        stall_name: "",
        stall_desc: "",
        stall_dept: "",
        stall_img: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/stalls/add-stall`, formData);
            navigate("/admin-panel");
        } catch (error) {
            console.error("Error registering stall:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-800 p-6">
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow text-white">
                <h2 className="text-2xl font-bold mb-6">Register New Stall</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">
                            Stall Name
                        </label>
                        <input
                            type="text"
                            name="stall_name"
                            value={formData.stall_name}
                            onChange={handleChange}
                            placeholder="Stall Name"
                            className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            name="stall_desc"
                            value={formData.stall_desc}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/50"
                            required
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Department
                        </label>
                        <input
                            type="text"
                            name="stall_dept"
                            value={formData.stall_dept}
                            onChange={handleChange}
                            placeholder="Department"
                            className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Image URL
                        </label>
                        <input
                            type="text"
                            name="stall_img"
                            value={formData.stall_img}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-full py-2 px-4 bg-white/5 border border-white/20 rounded text-white placeholder-white/50"
                            required
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm"
                        >
                            Register Stall
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/admin-panel")}
                            className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StallRegistration;
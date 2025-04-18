import React, { useState, useEffect } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import io from "socket.io-client";


const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [stallData, setStallData] = useState([]);
    const [interactionData, setInteractionData] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalUsers: 0,
        totalStalls: 0,
        totalInteractions: 0
    });
    const [genderData, setGenderData] = useState([]);
    const [deptLikesData, setDeptLikesData] = useState([]);
    const [stallInteractionsData, setStallInteractionsData] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/get-all-tables`);
                const data = await response.json();
                updateDashboardData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const newSocket = io(import.meta.env.VITE_API_URL);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
            setConnected(false);
            fetchAllData();
        });

        newSocket.on('all_data_update', (data) => {
            console.log('Received real-time data update');
            updateDashboardData(data);
        });

        setSocket(newSocket);

        fetchAllData();

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    const updateDashboardData = (data) => {
        setUserData(data.users);
        setStallData(data.stalls);
        setInteractionData(data.interactions);
        console.log(data.stalls);
        setSummaryStats({
            totalUsers: data.users.length,
            totalStalls: data.stalls.length,
            totalInteractions: data.interactions.length
        });

    };

    useEffect(() => {
        const genderCounts = userData.reduce((acc, user) => {
            acc[user.gender] = (acc[user.gender] || 0) + 1;
            return acc;
        }, {});

        const processedGenderData = Object.entries(genderCounts).map(
            ([name, value]) => ({ name, value })
        );
        setGenderData(processedGenderData);

        const deptLikes = stallData.reduce((acc, stall) => {
            const stallLikes = interactionData.filter(
                interaction =>
                    interaction.stall_id === stall.id &&
                    interaction.is_liked
            ).length;

            acc[stall.stall_dept] = (acc[stall.stall_dept] || 0) + stallLikes;
            return acc;
        }, {});

        const processedDeptLikesData = Object.entries(deptLikes).map(
            ([name, value]) => ({ name, value })
        );
        setDeptLikesData(processedDeptLikesData);

        const processedStallInteractions = stallData.map(stall => {
            const likes = interactionData.filter(
                interaction =>
                    interaction.stall_id === stall.id &&
                    interaction.is_liked
            ).length;

            const dislikes = interactionData.filter(
                interaction =>
                    interaction.stall_id === stall.id &&
                    !interaction.is_liked
            ).length;

            return {
                name: stall.stall_name,
                likes,
                dislikes
            };
        });
        setStallInteractionsData(processedStallInteractions);
    }, [userData, stallData, interactionData]);

    const COLORS = ['#1E40AF', '#06B6D4', '#3B82F6', '#0EA5E9', '#38BDF8'];


    return (
        <div className="h-screen bg-gray-50 flex flex-col p-4 gap-4">
            <div className="flex h-1/2 w-full gap-4">
                <div className="w-1/3 bg-white rounded p-4 text-gray-700 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Summary Statistics</h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                            <span>Total Users:</span>
                            <span>{summaryStats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Stalls:</span>
                            <span>{summaryStats.totalStalls}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Interactions:</span>
                            <span>{summaryStats.totalInteractions}</span>
                        </div>
                    </div>
                    <h2 className="text-lg font-semibold mb-4 mt-8">Top 3 Stalls by Likes</h2>
                    {stallInteractionsData
                        .sort((a, b) => b.likes - a.likes)
                        .slice(0, 3)
                        .map((stall, index) => (
                            <div key={stall.name} className="flex justify-between py-1">
                                <span>{index + 1}. {stall.name}</span>
                                <span>{stall.likes} likes</span>
                            </div>
                        ))
                    }
                </div>

                <div className="w-1/3 bg-white rounded p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Gender Distribution</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-1/3 bg-white rounded p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2 text-gray-700">Stall Likes by Department</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={deptLikesData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {deptLikesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="h-1/2 w-full bg-white rounded p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Stalls Likes and Dislikes</h2>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                        data={stallInteractionsData}
                        margin={{ left: 20, right: 20, bottom: 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                            stroke="#374151"
                        />
                        <YAxis stroke="#374151" />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 rounded shadow-sm border border-gray-100">
                                            <p className="font-semibold text-gray-700">{data.name}</p>
                                            <p className="text-blue-800">Likes: {data.likes}</p>
                                            <p className="text-cyan-500">Dislikes: {data.dislikes}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="likes" stackId="a" fill="#1E40AF" />
                        <Bar dataKey="dislikes" stackId="a" fill="#06B6D4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
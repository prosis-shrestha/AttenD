import React, { useState, useEffect } from 'react';
import { X, Heart, Undo, FastForward, Info } from 'lucide-react';
import { motion, useMotionValue, useTransform } from "framer-motion";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const [cards, setCards] = useState([]);
    const [history, setHistory] = useState([]);
    const [code, setCode] = useState("");
    const [userInfo, setUserInfo] = useState(null);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [demoCode, setDemoCode] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUnseenStalls = async () => {
            if (!userInfo?.id) return;

            try {
                const response = await axios.get(`/api/users/get-unseen-stalls/${userInfo.id}`);
                setCards(response.data);
            } catch (err) {
                console.error(err.message);
            }
        };

        if (userInfo) {
            fetchUnseenStalls();
        }
    }, [userInfo]);

    const handleAuth = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`/api/auth/get-user/${code}`);
            setUserInfo(response.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const removeCard = (direction) => {
        if (cards.length > 0) {
            console.log(`Card removed with direction: ${direction}`);
            const removedCard = cards[0];
            setHistory([{ card: removedCard, direction, stall_id: removedCard.id }, ...history]);
            setCards(cards.slice(1));
        }
    };

    const handleInteraction = async (stall_id, isLiked) => {
        console.log(cards)
        if (!userInfo || !userInfo.id) {
            console.error("User not logged in");
            return;
        }

        console.log(userInfo.id, stall_id, isLiked)

        try {
            const response = await axios.post(`/api/interactions/add-interaction`, {
                userId: userInfo.id,
                stall_id,
                isLiked,
            });

            if (response.status === 200) {
                console.log(`${isLiked ? 'Like' : 'Dislike'} interaction saved for stall ${stall_id}`);
            } else {
                console.error('Failed to save interaction:', response.data);
            }
        } catch (error) {
            console.error('Error saving interaction:', error);
        }
    };

    const handleLeft = (stall_id) => {
        console.log("Left button clicked (dislike)");
        handleInteraction(stall_id, false);
        removeCard('left');
    };

    const handleRight = (stall_id) => {
        console.log("Right button clicked (like)");
        handleInteraction(stall_id, true);
        removeCard('right');
    };

    const handleSkip = () => {
        console.log("Skip button clicked");
        removeCard('skip');
    };

    const handleUndo = async () => {
        if (history.length > 0) {
            console.log("Undoing last action");
            const [lastAction, ...remainingHistory] = history;

            if (lastAction.direction !== 'skip') {
                try {
                    await axios.delete(`/api/interactions/remove-interaction/${userInfo.id}/${lastAction.card.id}`);
                    setCards([lastAction.card, ...cards]);
                    setHistory(remainingHistory);
                } catch (error) {
                    console.error('Error removing interaction:', error);
                    return;
                }
            } else {
                setCards([lastAction.card, ...cards]);
                setHistory(remainingHistory);
            }
        } else {
            console.log("No actions to undo");
        }
    };

    const generateDemoCode = async () => {
        const userAgent = navigator.userAgent;

        let browser = "Unknown";
        if (userAgent.includes("Edg/")) browser = "Edge";
        else if (userAgent.includes("Chrome") && userAgent.includes("Safari")) browser = "Chrome";
        else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
        else if (userAgent.includes("Firefox")) browser = "Firefox";

        if (browser === "Chrome" && navigator.brave) {
            browser = "Brave";
        }

        // Create demo user data
        const demoUser = {
            username: `Demo_${browser}`,
            number: "99999",
            gender: "Other",
            code: Math.floor(10000 + Math.random() * 90000)
        };

        try {
            // Register the demo user
            await axios.post(`/api/users/add-users`, demoUser);
            setDemoCode(demoUser.code);
        } catch (err) {
            console.error("Error creating demo user:", err.message);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-cyan-500 to-blue-800 flex flex-col justify-around items-center">
            {!userInfo ?
                <>
                    <form onSubmit={handleAuth} className="max-w-md w-full space-y-8 p-8 lg:bg-white/10 backdrop-blur-sm rounded-lg lg:shadow-md text-white">
                        <div className="flex flex-col items-center">
                            <img src="/logo.png" alt="AttenD Logo" className="w-28 mb-4" />
                            <h2 className="text-center text-3xl font-extrabold">Login</h2>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Login Code</label>
                            <input
                                type="number"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="mt-1 py-2 px-4 block w-full rounded-md border-white/20 bg-white/5 shadow-sm focus:border-white focus:ring-white text-white placeholder-white/50"
                                placeholder="Enter your code"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded backdrop-blur-sm"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="w-full hover:bg-white/20 text-white py-2 px-4 rounded border-2 border-white/50"
                        >
                            Dashboard
                        </button>
                    </form>
                    <button
                        onClick={() => setShowDemoModal(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded backdrop-blur-sm"
                    >
                        <Info className="w-5 h-5" />
                        Try Demo
                    </button>
                </>
                :
                <>
                    {cards.length == 0 ?
                        <div className='text-white text-2xl font-bold'>
                            Thanks for attending the expo!
                        </div>
                        :
                        <>
                            <img src="/logo.png" alt="AttenD Logo" className="w-28" />
                            <div className="relative h-[500px] w-80">
                                {cards.map((card, index) => (
                                    <Card
                                        key={card.id}
                                        stall_id={card.id}
                                        stall_name={card.stall_name}
                                        stall_desc={card.stall_desc}
                                        stall_img={card.stall_img}
                                        stall_dept={card.stall_dept}
                                        isFirst={index === 0}
                                        handleLeft={handleLeft}
                                        handleRight={handleRight}
                                        zIndex={cards.length - index}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleLeft(cards[0]?.id)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <X className="w-6 h-6 text-blue-500" />
                                </button>
                                <button onClick={handleUndo} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <Undo className="w-6 h-6 text-yellow-500" />
                                </button>
                                <button onClick={handleSkip} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <FastForward className="w-6 h-6 text-green-600" />
                                </button>
                                <button onClick={() => handleRight(cards[0]?.id)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <Heart className="w-6 h-6 text-red-500" />
                                </button>
                            </div>
                        </>
                    }
                </>
            }

            {showDemoModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-800 backdrop-blur-sm rounded-lg p-6 max-w-md w-full space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Demo Options</h3>
                            <button
                                onClick={() => setShowDemoModal(false)}
                                className="text-white hover:text-white/80"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="text-white font-semibold mb-2">Option 1: Generate Demo Code</h4>
                                <p className="text-white/80 text-sm mb-3">Get a random Login code to test the user experience.</p>
                                {demoCode ? (
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-white bg-white/10 p-3 rounded-lg">
                                            {demoCode}
                                        </div>
                                        <p className="text-white/60 text-sm mt-2">Use this code to log in</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={generateDemoCode}
                                        className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded"
                                    >
                                        Generate Code
                                    </button>
                                )}
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg">
                                <h4 className="text-white font-semibold mb-2">Option 2: Admin Access</h4>
                                <p className="text-white/80 text-sm mb-3">Register user with Login code, manage stalls and view analytics.</p>
                                <button
                                    onClick={() => {
                                        setShowDemoModal(false);
                                        navigate("/admin-login");
                                    }}
                                    className="w-full bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded"
                                >
                                    Go to Admin Login (Passcode: 8888)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Card = ({ id, isFirst, handleLeft, handleRight, zIndex, stall_id, stall_name, stall_desc, stall_img, stall_dept }) => {
    const x = useMotionValue(0);
    const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
    const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

    const rotate = useTransform(() => {
        const offset = isFirst ? 0 : id % 2 ? 6 : -6;
        return `${rotateRaw.get() + offset}deg`;
    });

    const handleDragEnd = () => {
        if (Math.abs(x.get()) > 40) {
            if (x.get() > 0) {
                console.log("Dragged right");
                handleRight(stall_id);
            } else {
                console.log("Dragged left");
                handleLeft(stall_id);
            }
        }
    };

    return (
        <motion.div
            className="absolute top-0 left-0 h-full w-full"
            style={{
                x,
                opacity,
                rotate,
                zIndex,
                transition: "all 0.3s ease",
            }}
            animate={{
                scale: isFirst ? 1 : 0.98,
            }}
            drag={isFirst ? "x" : false}
            dragConstraints={{
                left: 0,
                right: 0,
            }}
            onDragEnd={handleDragEnd}
        >
            <div className="h-full w-full rounded-xl bg-white shadow-md overflow-hidden p-4">
                <img
                    src={stall_img}
                    // src={`https://res.cloudinary.com/dlkcexpuo/image/upload/c_fit,w_500,q_auto,f_webp/${stall_img.split('/').pop()}`}
                    alt={stall_name}
                    className="h-3/5 w-full object-cover rounded-lg"
                />
                <div className="p-4">
                    <h3 className="text-xl font-bold">{stall_name}</h3>
                    <p className="text-gray-600 mt-2">{stall_desc}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default Homepage;
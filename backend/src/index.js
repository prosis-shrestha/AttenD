const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const { fetchAllTablesData } = require("./services/db.service");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const initializeDatabase = require("./services/db-init.service");
const { setupPgListener } = require("./services/pg-listener.service");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const interactionRoutes = require("./routes/interaction.routes");
const stallRoutes = require("./routes/stall.routes");

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};

// const allowedOrigins = [
//   "http://localhost:3000", // for local dev
//   "https://frontend-production-d1aa.up.railway.app", // Railway frontend URL
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like curl, mobile apps)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS: " + origin));
//     }
//   },
//   methods: ["GET", "POST", "DELETE"],
//   credentials: true,
// };

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/stalls", stallRoutes);

io.on("connection", async (socket) => {
  console.log("Client connected:", socket.id);

  try {
    const allData = await fetchAllTablesData();
    socket.emit("all_data_update", allData);
  } catch (error) {
    console.error("Error sending initial data:", error);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.get("/api/get-all-tables", async (req, res) => {
  try {
    const allData = await fetchAllTablesData();
    res.json(allData);
  } catch (error) {
    console.error("Error in /get-all-tables:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startApp() {
  try {
    await initializeDatabase();
    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      setupPgListener(io);
    });
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

startApp();

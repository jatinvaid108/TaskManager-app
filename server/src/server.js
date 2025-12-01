import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env FROM server/.env
dotenv.config({ path: join(__dirname, "../.env") });

console.log("DEBUG_EMAIL_USER:", process.env.EMAIL_USER);
console.log("DEBUG_EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1) Create HTTP server from Express app
const server = http.createServer(app);

// 2) Attach Socket.io on top of HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://taskmanagerjv.netlify.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 3) Make io globally available (for createNotification.js)
globalThis.io = io;

// 4) Handle socket connections
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // front-end will send: socket.emit("join", userId)
  socket.on("join", (userId) => {
    if (!userId) return;
    socket.join(userId.toString());
    console.log(`👤 User ${userId} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// 5) Connect DB, then start server


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // Use HTTP server instead of app.listen !!!
    server.listen(PORT, () =>
      console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));


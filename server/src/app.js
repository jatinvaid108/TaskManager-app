import express from 'express';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

// ---------------- MIDDLEWARES ----------------

// CORS MUST BE FIRST
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// JSON parser
app.use(express.json());

// cookie parser MUST be before protected routes
app.use(cookieParser());

// Security headers
app.use(helmet());

// Logger
app.use(morgan("dev"));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/teams", teamRoutes);  // ✅ MOVED HERE
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy 💪" });
});

export default app;

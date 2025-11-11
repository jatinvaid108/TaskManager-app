import express from 'express';
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app=express();


// ---------------- MIDDLEWARES ----------------
// Parses incoming JSON data
app.use(express.json());

// Parse cookies sent from client
app.use(cookieParser());

// Add common security headers
app.use(helmet());

// Enable CORS so frontend can access backend
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server origin
    credentials: true, // allow sending cookies
  })
);

// Log HTTP requests (useful for dev)
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is healthy 💪" });
});

export default app;


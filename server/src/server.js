import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env FROM server/.env
dotenv.config({ path: join(__dirname, "../.env") });

console.log("DEBUG_EMAIL_USER:", process.env.EMAIL_USER);
console.log("DEBUG_EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import applicationRoutes from "./routes/applications.js";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";

// ENV
dotenv.config();

const app = express();

// Fix __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API ROUTES
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "JobTrackr API running",
    time: new Date().toISOString(),
  });
});

// 🔥 SERVE FRONTEND (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 🔁 SPA FALLBACK (FIXES REFRESH BUG)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

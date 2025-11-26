import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import applicationRoutes from './routes/applications.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

// Load environment env variables
dotenv.config();

const app = express();

// Security + CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,    // allow only your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1); // important for render

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request log
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    message: "JobTrackr API running successfully",
    time: new Date().toISOString()
  });
});

// MongoDB Connect
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log("\n🛑 Server shutting down...");
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed");
  process.exit(0);
});

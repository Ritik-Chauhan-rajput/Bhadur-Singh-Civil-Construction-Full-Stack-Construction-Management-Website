const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const enquiryRoutes = require("./routes/enquiryRoutes");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const projectRoutes = require("./routes/projectRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

const app = express();

app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((v) => v.trim())
      : true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bhadur Singh Construction API is running",
  });
});

// API routes
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/testimonials", testimonialRoutes);

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

// Start server
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const server = app.listen(PORT, HOST, () => {
      console.log("----------------------------------------");
      console.log("Bhadur Singh Construction Backend");
      console.log(`Server running on port: ${PORT}`);
      console.log(`Local URL: http://127.0.0.1:${PORT}`);
      console.log(`Browser URL: http://localhost:${PORT}`);
      console.log("----------------------------------------");
    });

    server.on("error", (error) => {
      console.error("SERVER START ERROR:");
      console.error(error);

      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already being used.`);
      }
    });

  } catch (error) {
    console.error("----------------------------------------");
    console.error("MongoDB connection failed:");
    console.error(error.message);
    console.error("----------------------------------------");

    process.exit(1);
  }
}

startServer();
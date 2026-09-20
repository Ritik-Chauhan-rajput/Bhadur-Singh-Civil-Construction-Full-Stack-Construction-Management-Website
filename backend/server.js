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

// ===============================
// CORS
// ===============================

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header
      if (!origin) {
        return callback(null, true);
      }

      // Local development
      const isLocalOrigin =
        origin === "http://localhost:5173" ||
        origin === "http://localhost:5174" ||
        origin === "http://localhost:5175" ||
        origin === "http://127.0.0.1:5173" ||
        origin === "http://127.0.0.1:5174" ||
        origin === "http://127.0.0.1:5175";

      // Production frontend
      if (isLocalOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ===============================
// JSON BODY
// ===============================

app.use(express.json({ limit: "1mb" }));

// ===============================
// STATIC UPLOADS
// ===============================

app.use("/uploads", express.static("uploads"));

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bhadur Singh Construction API is running",
  });
});

// ===============================
// API ROUTES
// ===============================

app.use("/api/enquiries", enquiryRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/services", serviceRoutes);

app.use("/api/testimonials", testimonialRoutes);

// ===============================
// ERROR HANDLER
// ===============================

app.use((error, req, res, next) => {
  if (error && error.message === "CORS origin not allowed") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed",
    });
  }

  if (error) {
    console.error("Request error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }

  next();
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

const HOST = "0.0.0.0";

// ===============================
// START SERVER
// ===============================

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
        console.error(
          `Port ${PORT} is already being used.`
        );
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
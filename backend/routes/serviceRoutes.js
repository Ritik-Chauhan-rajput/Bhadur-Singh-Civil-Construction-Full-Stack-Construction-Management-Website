const express = require("express");
const Service = require("../models/Service");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================
// VERIFY ADMIN
// =====================================

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin login required",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET);

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// =====================================
// GET ALL SERVICES
// =====================================

router.get("/", async (req, res) => {
  try {
    const items = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("Service GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load services",
    });
  }
});

// =====================================
// ADD SERVICE
// =====================================

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const service = new Service({
      title,
      description,
      icon: icon || "🏗️",
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      item: service,
    });

  } catch (error) {
    console.error("Service POST error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add service",
    });
  }
});

// =====================================
// DELETE SERVICE
// =====================================

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(
      req.params.id
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });

  } catch (error) {
    console.error("Service DELETE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
});

module.exports = router;
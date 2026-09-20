const express = require("express");
const Testimonial = require("../models/Testimonial");
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
// GET ALL TESTIMONIALS
// =====================================

router.get("/", async (req, res) => {
  try {
    const items = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("Testimonial GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load testimonials",
    });
  }
});

// =====================================
// ADD TESTIMONIAL
// =====================================

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      role,
      message,
      rating,
    } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    const testimonial = new Testimonial({
      name,
      role,
      message,
      rating: rating || 5,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      item: testimonial,
    });

  } catch (error) {
    console.error("Testimonial POST error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
    });
  }
});

// =====================================
// DELETE TESTIMONIAL
// =====================================

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const testimonial =
      await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });

  } catch (error) {
    console.error("Testimonial DELETE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete testimonial",
    });
  }
});

module.exports = router;
const express = require("express");
const Enquiry = require("../models/Enquiry");
const jwt = require("jsonwebtoken");

const router = express.Router();

// =====================================
// ADMIN AUTH MIDDLEWARE
// =====================================

const verifyAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Login required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// =====================================
// CREATE ENQUIRY
// =====================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      workType,
      message,
    } = req.body;

    if (!name || !phone || !workType) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone and work type are required",
      });
    }

    const enquiry = new Enquiry({
      name,
      phone,
      email,
      workType,
      message,
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Enquiry error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
});

// =====================================
// GET ALL ENQUIRIES
// =====================================

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error("Get enquiries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
    });
  }
});

// =====================================
// DELETE ENQUIRY
// =====================================

router.delete(
  "/:id",
  verifyAdmin,
  async (req, res) => {
    try {
      const enquiry = await Enquiry.findByIdAndDelete(
        req.params.id
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: "Enquiry not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Enquiry deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete enquiry error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to delete enquiry",
      });
    }
  }
);

module.exports = router;
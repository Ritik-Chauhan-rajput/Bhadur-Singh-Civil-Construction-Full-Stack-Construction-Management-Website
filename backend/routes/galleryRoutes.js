const express = require("express");
const Gallery = require("../models/Gallery");
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
// GET ALL GALLERY
// =====================================

router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("Gallery GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load gallery",
    });
  }
});

// =====================================
// ADD GALLERY
// =====================================

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const { title, category, image } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required",
      });
    }

    const gallery = new Gallery({
      title,
      category,
      image,
    });

    await gallery.save();

    res.status(201).json({
      success: true,
      message: "Gallery item added successfully",
      item: gallery,
    });

  } catch (error) {
    console.error("Gallery POST error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add gallery item",
    });
  }
});

// =====================================
// DELETE GALLERY
// =====================================

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });

  } catch (error) {
    console.error("Gallery DELETE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete gallery item",
    });
  }
});

module.exports = router;
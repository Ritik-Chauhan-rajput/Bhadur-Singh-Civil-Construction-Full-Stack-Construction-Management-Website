const express = require("express");
const Project = require("../models/Project");
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
// GET ALL PROJECTS
// =====================================

router.get("/", async (req, res) => {
  try {
    const items = await Project.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("Project GET error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load projects",
    });
  }
});

// =====================================
// ADD PROJECT
// =====================================

router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      category,
      location,
      description,
      image,
    } = req.body;

    if (!title || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required",
      });
    }

    const project = new Project({
      title,
      category,
      location,
      description,
      image,
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project added successfully",
      item: project,
    });

  } catch (error) {
    console.error("Project POST error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add project",
    });
  }
});

// =====================================
// DELETE PROJECT
// =====================================

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error) {
    console.error("Project DELETE error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
});

module.exports = router;
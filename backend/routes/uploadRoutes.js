const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpeg|jpg|png|webp)$/i;

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const extensionValid = allowedExtensions.test(file.originalname);
  const mimeValid = allowedMimeTypes.includes(file.mimetype);

  if (extensionValid && mimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/", (req, res) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.error("Multer upload error:", error.message);

      return res.status(400).json({
        success: false,
        message: error.message || "Image upload failed",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: `http://127.0.0.1:5000/uploads/${req.file.filename}`,
    });
  });
});

module.exports = router;
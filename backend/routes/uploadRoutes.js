const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, uniqueName);
  },
});

const allowedExtensions = /\.(jpeg|jpg|png|webp)$/i;

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileFilter = (req, file, cb) => {
  const extensionValid = allowedExtensions.test(file.originalname);
  const mimeValid = allowedMimeTypes.includes(file.mimetype);

  if (extensionValid && mimeValid) {
    return cb(null, true);
  }

  return cb(
    new Error("Only JPG, JPEG, PNG and WEBP images are allowed")
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

router.post("/", verifyAdmin, (req, res) => {
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

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
    });
  });
});

module.exports = router;
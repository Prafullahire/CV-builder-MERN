const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const {
  createCV,
  getCVs,
  getCVById,
  updateCV,
  deleteCV,
  downloadCV,
  shareCV,
} = require("../controllers/cvController");

const { protect } = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid CV ID" });
  }
  next();
};


// CREATE CV
router.post("/", protect, upload.single("image"), createCV);

// GET ALL CVs
router.get("/", protect, getCVs);

// GET SINGLE CV
router.get("/:id", protect, validateObjectId, getCVById);

// UPDATE CV
router.put("/:id", protect, validateObjectId, upload.single("image"), updateCV);

// DELETE CV
router.delete("/:id", protect, validateObjectId, deleteCV);


router.get("/:id/download", protect, validateObjectId, downloadCV);
router.get("/:id/share", protect, validateObjectId, shareCV);


module.exports = router;

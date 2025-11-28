const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, required: true, unique: true },
    contact: { type: String },

    // Normal Signup Users
    password: { type: String },

    // Google Login Users
    googleId: { type: String, unique: true, sparse: true },

    // Facebook Login Users (optional)
    facebookId: { type: String, unique: true, sparse: true },

    // Profile image from Google/Facebook
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

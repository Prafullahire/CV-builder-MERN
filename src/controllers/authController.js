const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, contact, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      contact,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  console.log("Body:", req.body);

  const { identifier, password } = req.body;

  if (!identifier || !password) {
    console.log("Missing fields");
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    console.log("Finding user...");
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email);
    console.log("Checking password...");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Wrong password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password correct");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Sending response");
    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
      },
      token,
    });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
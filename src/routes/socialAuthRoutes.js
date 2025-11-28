const express = require("express");
const router = express.Router();
const passport = require("passport");

// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token, user } = req.user;
    res.redirect(
      `http://localhost:5173/social-login-success?token=${token}&email=${user.email}&name=${user.username}`
    );
  }
);

module.exports = router;

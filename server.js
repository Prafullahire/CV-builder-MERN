// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./src/config/db");
// const passport = require("passport"); 
// const morgan = require("morgan");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

// // PASSPORT MUST BE INITIALIZED
// require("./src/config/passport");
// app.use(passport.initialize());



// app.use("/api/auth", require("./src/routes/authRoutes"));

// // CV + PAYMENT
// app.use("/api/cv", require("./src/routes/cvRoutes"));
// app.use("/api/payment", require("./src/routes/paymentRoutes"));

// // GOOGLE AUTH
// app.use("/auth", require("./src/routes/socialAuthRoutes"));

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
// Passport configuration
require("./src/config/passport");
app.use(passport.initialize());

// Routes
// const paymentRoutes = require("./src/routes/paymentRoutes");

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/cv", require("./src/routes/cvRoutes"));
// app.use("/api/payment", paymentRoutes);
const paymentRoutes = require("./src/routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

app.use("/auth", require("./src/routes/socialAuthRoutes"));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

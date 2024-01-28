const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser"); // parser middleware
require("./utils/passport-setup");
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/authentication-app", {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected"));

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json(req.user);
});

// Start the server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

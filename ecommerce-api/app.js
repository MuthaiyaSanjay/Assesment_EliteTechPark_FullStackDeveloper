require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/database");
const seedRoles = require("./utils/seedRoles");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Seed roles into the database
seedRoles();

app.use(express.json()); // Parse JSON request bodies

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js E-commerce API");
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// If the port is already in use, try a different one
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is already in use. Trying another port...`);
    const newPort = 3001; // or any other port you want to try
    app.listen(newPort, () => {
      console.log(`Server running on port ${newPort}`);
    });
  } else {
    console.error("Error starting server:", err);
  }
});

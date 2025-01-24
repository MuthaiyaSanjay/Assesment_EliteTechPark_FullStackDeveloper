const mongoose = require("mongoose");

// Import models
const User = require("./user");
const Role = require("./role");
const Product = require("./product");
const Vendor = require("./vendor");
const Staff = require("./staff");

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

module.exports = {
  User,
  Role,
  Product,
  Vendor,
  Staff,
};

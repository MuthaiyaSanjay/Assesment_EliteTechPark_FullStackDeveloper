const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Vendor", vendorSchema);

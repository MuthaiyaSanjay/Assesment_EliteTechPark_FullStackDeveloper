const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
});

module.exports = mongoose.model("Staff", staffSchema);

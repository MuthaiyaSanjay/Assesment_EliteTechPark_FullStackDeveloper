const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  priceOld: { type: Number, required: true },
  priceNew: { type: Number, required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  freeDelivery: { type: Boolean, default: false },
  deliveryAmount: { type: Number },
  imageUrl: { type: String },
  productUrl: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Product", productSchema);

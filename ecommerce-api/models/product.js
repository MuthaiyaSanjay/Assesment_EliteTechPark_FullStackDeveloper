const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    priceOld: { type: Number, required: true },
    priceNew: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    freeDelivery: { type: Boolean, default: false },
    deliveryAmount: { type: Number },
    imageUrl: { type: String, unique: true, required: true }, // Image URL must be unique
    productUrl: { type: String, unique: true, required: true },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor", // Assuming you have a Vendor model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Virtual field for calculating the discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.priceOld > 0) {
    return ((this.priceOld - this.priceNew) / this.priceOld) * 100;
  }
  return 0;
});

// Virtual field for calculating the discount amount
productSchema.virtual("discountAmount").get(function () {
  return this.priceOld - this.priceNew;
});

// Method to check if the product is expired
productSchema.methods.isExpired = function () {
  return Date.now() > this.expiryDate;
};

module.exports = mongoose.model("Product", productSchema);

const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  hash: { type: String, required: true, unique: true },  // Ensure the hash is unique
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;

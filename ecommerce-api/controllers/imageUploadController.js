require('dotenv').config(); // Load environment variables

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/images');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fsPromises = require('fs').promises;

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  console.log('Uploads directory does not exist. Creating it now...');
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created successfully.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting file destination to uploads directory.');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();  // Generate a unique identifier
    const fileName = uniqueId + path.extname(file.originalname);  // Append the original file extension
    console.log(`Generating unique file name: ${fileName}`);
    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    console.log(`Received file with MIME type: ${file.mimetype}`);
    if (!allowedTypes.includes(file.mimetype)) {
      console.log('Invalid file type detected.');
      return cb(new Error('Invalid file type. Only JPG, PNG, and GIF are allowed.'));
    }
    console.log('File type is valid.');
    cb(null, true);
  },
});

const uploadImage = async (req, res) => {
  try {
    console.log('Received upload request:', req.body);
    console.log('Received file:', req.file);

    const vendorId = req.user.id;
    console.log('Vendor Id: ', vendorId);

    if (!req.file || !vendorId) {
      console.log('Missing file or vendorId in the request.');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or vendorId not provided',
      });
    }

    // Step 1: Generate the hash of the image content
    const filePath = path.join(uploadDir, req.file.filename);
    const fileBuffer = await fsPromises.readFile(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    console.log(`Generated hash for file: ${hash}`);

    // Step 2: Check if the image with this hash already exists in the database
    const existingImage = await Image.findOne({ hash });
    if (existingImage) {
      // Step 3: If the image already exists, reject the upload
      console.log('Duplicate image detected. Rejecting upload.');
      return res.status(400).json({
        success: false,
        message: 'Duplicate image detected. This image has already been uploaded.',
      });
    }

    const fileUrl = `localhost:12345/uploads/${req.file.filename}`; // Use environment variable here
    console.log(`Image file URL: ${fileUrl}`);

    // Step 4: Save the image details, including the hash
    const newImage = new Image({
      filename: req.file.filename,
      url: fileUrl,
      vendorId: vendorId,
      hash: hash,  // Store the image hash in the database
    });

    console.log('Saving image details to the database...');
    await newImage.save();
    console.log('Image saved successfully to MongoDB:', newImage);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      fileUrl,
      imageId: newImage._id,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadImage,
};

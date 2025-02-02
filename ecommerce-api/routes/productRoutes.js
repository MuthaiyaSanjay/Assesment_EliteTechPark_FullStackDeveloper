const express = require("express");
const productController = require("../controllers/productController");
const { upload, uploadImage } = require('../controllers/imageUploadController'); // The controller we will create
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

// Public routes: Accessible by everyone
router.get("/", productController.getProducts); // View all products
router.get("/:id", productController.getProductById); // View a single product by ID
router.get("/category/:category", productController.getProductsByCategory); // View products by category
router.get("/search", productController.searchProducts);

// Upload image route (only allow vendors or admins to upload images)
router.post('/upload', authMiddleware, roleMiddleware(["admin", "vendor"]), upload.single('file'), uploadImage);

// Protected routes for Admin, Staff, and Vendor roles
router.post("/", authMiddleware, roleMiddleware(["admin", "vendor"]), productController.createProduct); // Create a product
router.put("/:id", authMiddleware, roleMiddleware(["admin", "staff", "vendor"]), productController.updateProduct); // Update a product
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), productController.deleteProduct); // Delete a product
router.get("/vendor/:vendorId", authMiddleware, roleMiddleware(["admin", "vendor"]), productController.getProductsByVendor); // Get products by vendor

module.exports = router;

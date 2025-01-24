const express = require("express");
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware"); // Assuming this is where your role-based control is defined
const router = express.Router();

// Public routes: Accessible by everyone (no role check)
router.get("/", productController.getProducts); // View all products
router.get("/:id", productController.getProductById); // View a single product by ID
router.get("/category/:category", productController.getProductsByCategory); // View products by category
router.get("/search", productController.searchProducts);
// Protected routes for Admin, Staff, and Vendor roles
// Create a product: Admin only
router.post("/", authMiddleware, roleMiddleware(["admin"]), productController.createProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), productController.deleteProduct);


router.put("/:id", authMiddleware, roleMiddleware(["admin", "staff", "vendor"]), productController.updateProduct);
router.get("/vendor/:vendorId", authMiddleware, roleMiddleware(["admin", "vendor"]), productController.getProductsByVendor);


module.exports = router;

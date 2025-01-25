const { Product, Images } = require("../models");
const logger = require('../utils/logger'); // Import the logger

// Get all products with optional search and pagination
exports.getProducts = async (req, res) => {
  try {
    logger.info('Fetching products');  // Log action
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const products = await Product.find(filter).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);

    logger.info(`Fetched ${products.length} products`);
    res.json({ products, total });
  } catch (error) {
    logger.error('Error fetching products: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { matchType = "contains" } = req.query;

    logger.info(`Fetching products in category: ${category}`);
    
    let regex;
    if (matchType === "startsWith") {
      regex = new RegExp(`^${category}`, "i");
    } else if (matchType === "endsWith") {
      regex = new RegExp(`${category}$`, "i");
    } else {
      regex = new RegExp(category, "i");
    }

    const products = await Product.find({ category: regex });

    if (products.length === 0) {
      logger.warn(`No products found in category: ${category}`);
      return res.status(404).json({ message: "No products found in this category" });
    }

    logger.info(`Fetched ${products.length} products in category: ${category}`);
    res.json({ products });
  } catch (error) {
    logger.error('Error fetching products by category: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    logger.info(`Fetching product with ID: ${req.params.id}`);
    const product = await Product.findById(req.params.id);
    if (!product) {
      logger.warn(`Product with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info(`Product found: ${product.name}`);
    res.json(product);
  } catch (error) {
    logger.error('Error fetching product by ID: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a product
exports.createProduct = async (req, res) => {
  try {
    logger.info('Creating new product');
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;

    const vendorId = req.user.id;
    if (!vendorId) {
      logger.warn('Vendor ID not found in token');
      return res.status(403).json({ message: "Vendor ID not found in the token" });
    }

    if (!name || !description || !priceOld || !priceNew || !imageUrl) {
      logger.warn('Required fields missing: Name, description, old price, new price, and image URL are required');
      return res.status(400).json({ message: "Name, description, old price, new price, and image URL are required" });
    }

    // Check if the imageUrl exists in the Image model
    const existingImage = await Images.findOne({ url: imageUrl });
    if (!existingImage) {
      logger.warn('Image URL does not exist in the Image model');
      return res.status(400).json({ message: "The provided image URL does not exist in the Image model" });
    }

    // Check if imageUrl is unique in the Product model
    const existingProduct = await Product.findOne({ imageUrl });
    if (existingProduct) {
      logger.warn('Image URL already exists in another product');
      return res.status(400).json({ message: "The provided image URL is already associated with another product" });
    }

    // Generate a unique product URL
    const productUrl = `product-${Math.random().toString(36).substring(7)}`;

    // Calculate expiry date (7 days from the start date)
    const startDate = new Date();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newProduct = new Product({
      name,
      description,
      category,
      priceOld,
      priceNew,
      startDate,
      expiryDate,
      freeDelivery,
      deliveryAmount,
      imageUrl,
      productUrl,
      vendorId,
    });

    await newProduct.save();
    logger.info('Product created successfully');
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    logger.error('Error creating product: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product by ID (Admin, Staff, and Vendor roles)
exports.updateProduct = async (req, res) => {
  try {
    logger.info(`Updating product with ID: ${req.params.id}`);
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;
    const vendorId = req.user.id;

    if (!vendorId) {
      logger.warn('Vendor ID not found in token');
      return res.status(403).json({ message: "Vendor ID not found in the token" });
    }

    if (!name || !description || !priceOld || !priceNew) {
      logger.warn('Required fields missing: Name, description, old price, and new price are required');
      return res.status(400).json({ message: "Name, description, old price, and new price are required" });
    }

    // Validate the provided image URL
    if (imageUrl) {
      // Check if the imageUrl exists in the Image model
      const existingImage = await Images.findOne({ url: imageUrl });
      if (!existingImage) {
        logger.warn('Image URL does not exist in the Image model');
        return res.status(400).json({ message: "The provided image URL does not exist in the Image model" });
      }

      // Check if the imageUrl is unique in the Product model (excluding the current product)
      const existingProduct = await Product.findOne({ imageUrl, _id: { $ne: req.params.id } });
      if (existingProduct) {
        logger.warn('Image URL already exists in another product');
        return res.status(400).json({ message: "The provided image URL is already associated with another product" });
      }
    }

    // Calculate new expiry date (7 days from the current date)
    const startDate = new Date();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        priceOld,
        priceNew,
        startDate,
        expiryDate,
        freeDelivery,
        deliveryAmount,
        imageUrl,
        vendorId,
      },
      { new: true }
    );

    if (!updatedProduct) {
      logger.warn(`Product with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info('Product updated successfully');
    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    logger.error('Error updating product: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product by ID (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    logger.info(`Deleting product with ID: ${req.params.id}`);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      logger.warn(`Product with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info('Product deleted successfully');
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error('Error deleting product: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by vendor (Admin and Vendor roles)
exports.getProductsByVendor = async (req, res) => {
  try {
    logger.info(`Fetching products by vendor with ID: ${req.params.vendorId}`);
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId });

    if (products.length === 0) {
      logger.warn(`No products found for vendor: ${vendorId}`);
      return res.status(404).json({ message: "No products found for this vendor" });
    }

    logger.info(`Fetched ${products.length} products for vendor: ${vendorId}`);
    res.json({ products });
  } catch (error) {
    logger.error('Error fetching products by vendor: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    logger.info('Searching for products');
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const products = await Product.find(filter).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);

    logger.info(`Found ${products.length} products matching search criteria`);
    res.json({ products, total });
  } catch (error) {
    logger.error('Error searching for products: ' + error.message);
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

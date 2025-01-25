const { Product , Images} = require("../models"); // Import the Product model

// Get all products with optional search and pagination
exports.getProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const products = await Product.find(filter).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);

    res.json({ products, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { matchType = "contains" } = req.query;

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
      return res.status(404).json({ message: "No products found in this category" });
    }

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;

    const vendorId = req.user.id;
    if (!vendorId) {
      return res.status(403).json({ message: "Vendor ID not found in the token" });
    }

    if (!name || !description || !priceOld || !priceNew || !imageUrl) {
      return res.status(400).json({ message: "Name, description, old price, new price, and image URL are required" });
    }

    // Check if the imageUrl exists in the Image model (your custom model)
    const existingImage = await Images.findOne({ url: imageUrl }); // Using your custom Image model
    if (!existingImage) {
      return res.status(400).json({ message: "The provided image URL does not exist in the Image model" });
    }

    // Check if imageUrl is unique in the Product model
    const existingProduct = await Product.findOne({ imageUrl });
    if (existingProduct) {
      return res.status(400).json({ message: "The provided image URL is already associated with another product" });
    }

    // Generate a unique product URL
    const productUrl = `product-${Math.random().toString(36).substring(7)}`;

    // Calculate expiry date (7 days from the start date)
    const startDate = new Date();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

    // Create the new product
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
      vendorId, // Automatically assigned vendorId from the token
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product by ID (Admin, Staff, and Vendor roles)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;
    const vendorId = req.user.id; 
    if (!vendorId) {
      return res.status(403).json({ message: "Vendor ID not found in the token" });
    }
    if (!name || !description || !priceOld || !priceNew) {
      return res.status(400).json({ message: "Name, description, old price, and new price are required" });
    }

    // Calculate expiry date (7 days from the start date)
    const startDate = new Date();
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

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
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a product by ID (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by vendor (Admin and Vendor roles)
exports.getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const products = await Product.find({ vendorId }); // Assuming vendorId is stored in the Product model

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this vendor" });
    }

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search products (can be used by admins, staff, vendors, and users)
exports.searchProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const products = await Product.find(filter).skip(skip).limit(limit);
    const total = await Product.countDocuments(filter);

    res.json({ products, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const { Product } = require("../models"); // Import the Product model

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

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;

    if (!name || !description || !priceOld || !priceNew) {
      return res.status(400).json({ message: "Name, description, old price, and new price are required" });
    }

    const productUrl = `product-${Math.random().toString(36).substring(7)}`;

    const newProduct = new Product({
      name,
      description,
      category,
      priceOld,
      priceNew,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
      freeDelivery,
      deliveryAmount,
      imageUrl,
      productUrl,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, priceOld, priceNew, freeDelivery, deliveryAmount, imageUrl } = req.body;

    if (!name || !description || !priceOld || !priceNew) {
      return res.status(400).json({ message: "Name, description, old price, and new price are required" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        priceOld,
        priceNew,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        freeDelivery,
        deliveryAmount,
        imageUrl,
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

// Delete a product by ID
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

// Get products by vendor
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

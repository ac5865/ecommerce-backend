const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    // Optional query parameters for filtering
    const { category } = req.query;

    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = new RegExp(`^${category}$`, "i"); // Case-insensitive match
    }

    const products = await Product.find(query).select(
      "-description -condition -__v"
    );

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await Product.findOne({ id: productId }).select("-__v");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;

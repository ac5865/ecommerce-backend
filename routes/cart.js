const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// POST /api/cart/add - Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    // Validate input
    if (!productId || !quantity || !userId) {
      return res.status(400).json({
        success: false,
        message: "productId, quantity, and userId are required",
      });
    }

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check if product exists
    const product = await Product.findOne({ id: parseInt(productId) });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ userId: parseInt(userId) });

    if (!cart) {
      cart = new Cart({
        userId: parseInt(userId),
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === parseInt(productId)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      cart.items[existingItemIndex].updatedAt = new Date();
    } else {
      // Add new item
      cart.items.push({
        productId: parseInt(productId),
        quantity: parseInt(quantity),
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart successfully",
      data: {
        cartItems: cart.items.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// GET /api/cart/:userId - Get user's cart items
router.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // Get cart for user
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    // Enrich cart items with product details
    const enrichedCart = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findOne({ id: item.productId }).select(
          "-__v"
        );
        return {
          productId: item.productId,
          quantity: item.quantity,
          addedAt: item.addedAt,
          updatedAt: item.updatedAt,
          product: product || null,
        };
      })
    );

    // Calculate total
    const total = enrichedCart.reduce((sum, item) => {
      if (item.product && item.product.price) {
        const price = parseFloat(item.product.price.replace("$", ""));
        return sum + price * item.quantity;
      }
      return sum;
    }, 0);

    res.json({
      success: true,
      data: {
        items: enrichedCart,
        totalItems: cart.items.length,
        totalPrice: total.toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete("/remove", async (req, res) => {
  try {
    const { productId, userId } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "productId and userId are required",
      });
    }

    const cart = await Cart.findOne({ userId: parseInt(userId) });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => item.productId !== parseInt(productId)
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart successfully",
      data: {
        cartItems: cart.items.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

// DELETE /api/cart/clear/:userId - Clear user's cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({
      success: true,
      message: "Cart cleared successfully",
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

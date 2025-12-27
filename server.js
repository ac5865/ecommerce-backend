const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
const productsRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Thrift Shop API",
    endpoints: {
      products: "/api/products",
      productById: "/api/products/:id",
      login: "/api/auth/login",
      user: "/api/auth/user/:userId",
      addToCart: "/api/cart/add",
      getCart: "/api/cart/:userId",
      removeFromCart: "/api/cart/remove",
      clearCart: "/api/cart/clear/:userId",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🛍️  Thrift Shop API running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

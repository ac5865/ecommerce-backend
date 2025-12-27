const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
require("dotenv").config();

const users = [
  {
    userId: 1,
    email: "abc@xyz.com",
    password: "password123",
    name: "John Doe",
    profileImage: null,
  },
  {
    userId: 2,
    email: "def@xyz.com",
    password: "mypassword",
    name: "Jane Smith",
    profileImage: null,
  },
];

const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: "$45",
    imgUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    category: "Clothing",
    description:
      "Classic vintage denim jacket in excellent condition. Perfect for casual outings.",
    condition: "Excellent",
  },
  {
    id: 2,
    name: "Leather Handbag",
    price: "$65",
    imgUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    category: "Accessories",
    description:
      "Genuine leather handbag with multiple compartments. Timeless design.",
    condition: "Like New",
  },
  {
    id: 3,
    name: "Classic Sneakers",
    price: "$35",
    imgUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    category: "Shoes",
    description: "Comfortable classic sneakers suitable for everyday wear.",
    condition: "Good",
  },
  {
    id: 4,
    name: "Wool Scarf",
    price: "$20",
    imgUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9",
    category: "Accessories",
    description:
      "Soft wool scarf perfect for cold weather. Various colors available.",
    condition: "Excellent",
  },
  {
    id: 5,
    name: "Cotton T-Shirt",
    price: "$15",
    imgUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    category: "Clothing",
    description: "100% cotton t-shirt. Breathable and comfortable fabric.",
    condition: "New",
  },
  {
    id: 6,
    name: "Running Shoes",
    price: "$55",
    imgUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "Shoes",
    description: "High-performance running shoes with excellent cushioning.",
    condition: "Like New",
  },
  {
    id: 7,
    name: "Summer Dress",
    price: "$40",
    imgUrl: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217",
    category: "Clothing",
    description: "Light and breezy summer dress perfect for warm weather.",
    condition: "Excellent",
  },
  {
    id: 8,
    name: "Sunglasses",
    price: "$30",
    imgUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    category: "Accessories",
    description: "Stylish sunglasses with UV protection.",
    condition: "New",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/thrift-shop",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("📡 Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert users
    await User.insertMany(users);
    console.log("✅ Users seeded");

    // Insert products
    await Product.insertMany(products);
    console.log("✅ Products seeded");

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();

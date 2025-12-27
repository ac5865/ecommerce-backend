const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Clothing", "Accessories", "Shoes"],
    },
    description: {
      type: String,
      default: "",
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Excellent"],
      default: "Good",
    },
    stock: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product", "name price image"); // populate only relevant fields


  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user?.cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  const quantity = Math.max(1, qty); // ensure qty >= 1

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    // increment quantity if already exists
    user.cart[itemIndex].qty += quantity;
  } else {
    user.cart.push({ product: productId, qty: quantity });
  }

  await user.save();

  // Return updated cart with populated product info
  const updatedUser = await User.findById(req.user._id).populate("cart.product", "name price image");
  res.status(201).json(updatedUser.cart);
});
export const updateToCart = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || !qty) {
    return res.status(400).json({ message: "Product ID and quantity are required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const itemIndex = user.cart.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    // increment quantity if already exists
    user.cart[itemIndex].qty = qty;
  } else {
    user.cart.push({ product: productId, qty });
  }

  await user.save();

  // Return updated cart with populated product info
  const updatedUser = await User.findById(req.user._id).populate("cart.product", "name price image");
  res.status(201).json(updatedUser.cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cart = user.cart.filter(item => item.product.toString() !== req.params.id);

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate("cart.product", "name price image");
  res.json(updatedUser.cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.cart = [];
  await user.save();

  res.json({ message: "Cart cleared" });
});

import express from "express";
const router = express.Router();
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateToCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

// Customer-only
router.route("/").get(protect, getCart).post(protect, addToCart).delete(protect, clearCart).put(protect, updateToCart);
router.route("/:id").delete(protect, removeFromCart);

export default router;

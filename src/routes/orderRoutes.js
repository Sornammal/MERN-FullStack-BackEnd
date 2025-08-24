import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

// Customer
router.route("/").post(protect, addOrderItems); // place order
router.route("/myorders").get(protect, getMyOrders); // user's orders
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);

// Admin
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
router.route("/").get(protect, admin, getOrders);

export default router;

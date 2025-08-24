import express from "express";
const router = express.Router();
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

// Public
router.post("/register", registerUser);
router.post("/login", authUser);

// Private
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;


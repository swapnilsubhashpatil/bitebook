import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  getMe,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/me", protect, updateUser);
router.get("/me", protect, getMe);
router.post("/logout", logoutUser);

export default router;

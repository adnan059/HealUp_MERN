import express from "express";
import {
  getCurrentUserCtrl,
  loginCtrl,
  logoutCtrl,
  registerCtrl,
} from "../controllers/authCtrl";
import {
  loginValidator,
  registerValidator,
} from "../lib/validators/authValidator";
import { validateRequest } from "../middlewares/validateRequest";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Register
router.post("/register", registerValidator, validateRequest, registerCtrl);

// Login
router.post("/login", loginValidator, validateRequest, loginCtrl);

// Logout
router.post("/logout", verifyToken, logoutCtrl);

// get current user
router.get("/getCurrentUser", verifyToken, getCurrentUserCtrl);

export default router;

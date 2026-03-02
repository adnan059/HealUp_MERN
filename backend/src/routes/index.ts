import express from "express";

import authRoutes from "./authRoutes";
import doctorRoutes from "./doctorRoutes";
import appointmentRoutes from "./appointmentRoutes";
import adminRoutes from "./adminRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/doctors", doctorRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/admin", adminRoutes);

export default router;

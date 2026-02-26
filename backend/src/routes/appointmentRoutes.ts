import express from "express";
import {
  createAppointment,
  getAvailableSlots,
  getNextWorkingDays,
} from "../controllers/appointmentCtrl";
import { verifyToken } from "../middlewares/authMiddleware";
import { monoIdParam } from "../lib/validators/commonValidator";
import { validateRequest } from "../middlewares/validateRequest";
const router = express.Router();

router.get(
  "/working-days/:doctorId",
  monoIdParam("doctorId"),
  validateRequest,
  getNextWorkingDays,
);

router.get("/available-slots", getAvailableSlots);

router.post("/book", verifyToken, createAppointment);

export default router;

import express from "express";
import {
  createAppointment,
  getAvailableSlots,
  getMyAppointmentsAsDoctor,
  getMyAppointmentsAsPatient,
  getNextWorkingDays,
} from "../controllers/appointmentCtrl";
import { verifyToken } from "../middlewares/authMiddleware";
import { monoIdParam } from "../lib/validators/commonValidator";
import { validateRequest } from "../middlewares/validateRequest";
import {
  paymentCallback,
  startPayment,
  getPaymentStatus,
} from "../controllers/paymentCtrl";

const router = express.Router();

router.get("/my-appointments", verifyToken, getMyAppointmentsAsPatient);

router.get("/my-patients", verifyToken, getMyAppointmentsAsDoctor);

router.get(
  "/working-days/:doctorId",
  monoIdParam("doctorId"),
  validateRequest,
  getNextWorkingDays,
);

router.get("/available-slots", getAvailableSlots);

router.post("/book", verifyToken, createAppointment);

router.post("/start-payment", verifyToken, startPayment);

router.get("/payment-callback", paymentCallback);

router.get("/payment-status", verifyToken, getPaymentStatus);

export default router;

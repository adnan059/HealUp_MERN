import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware";
import { monoIdParam } from "../lib/validators/commonValidator";
import { doctorApprovalValidator } from "../lib/validators/doctorValidator";
import { validateRequest } from "../middlewares/validateRequest";
import { handleDoctorApprovalCtrl } from "../controllers/adminCtrl";
const router = express.Router();

// handle approval of a doctor
router.put(
  "/approve/doctor/:id",
  verifyToken,
  verifyAdmin,
  monoIdParam("id"),
  doctorApprovalValidator,
  validateRequest,
  handleDoctorApprovalCtrl,
);

export default router;

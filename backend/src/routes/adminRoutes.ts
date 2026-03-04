import express from "express";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware";
import { monoIdParam } from "../lib/validators/commonValidator";
import {
  doctorApprovalValidator,
  getAllDoctorsForAdminValidator,
} from "../lib/validators/doctorValidator";
import { validateRequest } from "../middlewares/validateRequest";
import {
  getAllDoctorsForAdminCtrl,
  handleDoctorApprovalCtrl,
} from "../controllers/adminCtrl";
const router = express.Router();

// Get doctors with pagination/filtering/search
router.get(
  "/doctors",
  verifyToken,
  verifyAdmin,
  getAllDoctorsForAdminValidator,
  validateRequest,
  getAllDoctorsForAdminCtrl,
);

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

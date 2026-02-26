import express from "express";
import {
  createDoctorValidator,
  doctorApprovalValidator,
} from "../lib/validators/doctorValidator";
import { validateRequest } from "../middlewares/validateRequest";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware";
import {
  handleDoctorApprovalCtrl,
  createDoctorCtrl,
  findDoctorByIdCtrl,
  findRandomDoctorsCtrl,
  findAllDoctors,
} from "../controllers/doctorCtrl";
import { monoIdParam } from "../lib/validators/commonValidator";

const router = express.Router();

// create doctor
router.post(
  "/create",
  verifyToken,
  createDoctorValidator,
  validateRequest,
  createDoctorCtrl,
);

// find some random doctors
router.get("/find/random", findRandomDoctorsCtrl);

// find all doctors
router.get("/find/all", findAllDoctors);

// find a doctor by id
router.get("/find/:id", monoIdParam("id"), validateRequest, findDoctorByIdCtrl);

// handle approval of a doctor
router.put(
  "/approve/:id",
  verifyToken,
  verifyAdmin,
  monoIdParam("id"),
  doctorApprovalValidator,
  validateRequest,
  handleDoctorApprovalCtrl,
);

export default router;

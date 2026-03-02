import express from "express";
import { createDoctorValidator } from "../lib/validators/doctorValidator";
import { validateRequest } from "../middlewares/validateRequest";
import { verifyToken } from "../middlewares/authMiddleware";
import {
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

export default router;

import express from "express";
import { createDoctorValidator } from "../lib/validators/doctorValidator";
import { validateRequest } from "../middlewares/validateRequest";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware";
import {
  createDoctorCtrl,
  findDoctorByIdCtrl,
  findRandomDoctorsCtrl,
  findAllDoctors,
} from "../controllers/doctorCtrl";
import { monoIdParam } from "../lib/validators/commonValidator";
import { Doctor } from "../models/doctorModel";

const router = express.Router();

// create doctor
router.post(
  "/create",
  verifyToken,
  createDoctorValidator,
  validateRequest,
  createDoctorCtrl,
);

router.get("/debug-sort", verifyToken, verifyAdmin, async (req, res) => {
  console.log("gdfgfd");
  const { sortBy = "name", sortOrder = "asc" } = req.query as Record<
    string,
    string
  >;

  const sortFieldMap: Record<string, string> = {
    name: "_userName",
    email: "_userEmail",
  };
  const resolvedSortField = sortFieldMap[sortBy] ?? sortBy;

  const result = await Doctor.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        _userName: "$user.name",
        _userEmail: "$user.email",
      },
    },
    { $sort: { [resolvedSortField]: sortOrder === "asc" ? 1 : -1 } },
    { $limit: 10 },
    {
      $project: {
        _userName: 1,
        _userEmail: 1,
        specialty: 1,
        experience: 1,
      },
    },
  ]);

  res.json(result);
});

// find some random doctors
router.get("/find/random", findRandomDoctorsCtrl);

// find all doctors
router.get("/find/all", findAllDoctors);

// find a doctor by id
router.get("/find/:id", monoIdParam("id"), validateRequest, findDoctorByIdCtrl);

export default router;

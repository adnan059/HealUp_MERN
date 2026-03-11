import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest, ICreateDoctorReqBody } from "../lib/types";
import mongoose, { Types } from "mongoose";
import { createError } from "../lib/utils";
import { Doctor } from "../models/doctorModel";
import DoctorSchedule from "../models/doctorScheduleModel";

// create a doctor account
export const createDoctorCtrl = async (
  req: AuthenticatedRequest<ICreateDoctorReqBody>,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user) {
      return next(createError(401, "Unauthorized"));
    }
    if (req.user.roles.includes("doctor")) {
      return next(createError(400, "You already have doctor account"));
    }
    const {
      specialty,
      degree,
      experience,
      about,
      fees,
      address,
      workingDays,
      slotDuration,
    } = req.body;

    const existingDoctor = await Doctor.findOne({ userId: req.user._id });

    if (existingDoctor) {
      return next(createError(409, "Doctor profile already exists"));
    }

    const [doctor] = await Doctor.create(
      [
        {
          userId: req.user._id,
          specialty,
          degree,
          experience,
          about,
          fees,
          address: address || "",
          isApproved: false,
        },
      ],
      { session },
    );

    const [doctorSchedule] = await DoctorSchedule.create(
      [
        {
          doctorId: doctor._id,
          workingDays,
          slotDuration,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res
      .status(201)
      .json({ ...doctor.toObject(), ...doctorSchedule.toObject() });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session.endSession();
  }
};

// find a doctor by id
export const findDoctorByIdCtrl = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      isApproved: true,
    }).populate("userId", "name email avatar roles");
    if (!doctor) {
      return next(createError(404, "Doctor not found"));
    }

    const doctorObj = doctor.toObject();
    const doctorSchedule = await DoctorSchedule.findOne({
      doctorId: doctorObj._id,
    });
    const doctorScheduleObj = doctorSchedule?.toObject();
    res.status(200).json({ ...doctorObj, ...doctorScheduleObj });
  } catch (error) {
    next(error);
  }
};

// find all doctors
export const findAllDoctors = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      specialty = "all",
      sort = "",
      page = "1",
      limit = "6",
    } = req.query as Record<string, string>;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const query: any = { isApproved: true };

    if (specialty !== "all") {
      query.specialty = specialty;
    }

    let sortOption: any = {};

    if (sort === "fees_high") sortOption = { fees: -1 };
    if (sort === "fees_low") sortOption = { fees: 1 };
    if (sort === "exp_high") sortOption = { experience: -1 };
    if (sort === "exp_low") sortOption = { experience: 1 };

    const total = await Doctor.countDocuments(query);

    const doctors = await Doctor.find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate("userId", "name email avatar roles");

    res.status(200).json({
      data: doctors,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    next(error);
  }
};

// find random doctors as featured doctors
export const findRandomDoctorsCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctors = await Doctor.aggregate([
      { $match: { isApproved: true } },

      { $sample: { size: 4 } },

      {
        $lookup: {
          from: "users", // collection name (IMPORTANT: lowercase + plural)
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },

      { $unwind: "$userId" }, // flatten user array

      {
        $project: {
          specialty: 1,
          degree: 1,
          experience: 1,
          fees: 1,
          isApproved: 1,
          "userId._id": 1,
          "userId.name": 1,
          "userId.email": 1,
          "userId.avatar": 1,
          "userId.roles": 1,
        },
      },
    ]);

    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

export const findDoctorByUserIdCtrl = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return next(createError(404, "Doctor Profile Not Found"));
    }

    const doctorScheduleDetails = await DoctorSchedule.findOne({
      doctorId: doctor?._id,
    });

    res
      .status(200)
      .json({ ...doctor.toObject(), ...doctorScheduleDetails?.toObject() });
  } catch (error) {
    next(error);
  }
};

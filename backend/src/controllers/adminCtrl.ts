import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Doctor } from "../models/doctorModel";
import { createError } from "../lib/utils";
import User from "../models/userModel";

// approve a doctor
export const handleDoctorApprovalCtrl = async (
  req: Request<{ id: string }, {}, { isApproved: boolean }>,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const doctor = await Doctor.findById(id).session(session);

    if (!doctor) {
      await session.abortTransaction();
      return next(createError(404, "Doctor not found"));
    }

    if (doctor.isApproved === isApproved) {
      await session.abortTransaction();
      return next(
        createError(
          400,
          `Doctor account is already ${isApproved ? "approved" : "in pending status"}`,
        ),
      );
    }

    const user = await User.findById(doctor.userId).session(session);

    if (!user) {
      await session.abortTransaction();
      return next(createError(404, "User not found"));
    }

    doctor.isApproved = isApproved;
    if (isApproved) {
      user.roles = [...user.roles, "doctor"];
    }

    await doctor.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "User roles has been updated successfully" });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session.endSession();
  }
};

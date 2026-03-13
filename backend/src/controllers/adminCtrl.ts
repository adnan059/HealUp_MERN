import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { Doctor } from "../models/doctorModel";
import { createError } from "../lib/utils";
import User from "../models/userModel";
import DoctorSchedule from "../models/doctorScheduleModel";

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

// get doctors with pagination, sorting, filtering and search

export const getAllDoctorsForAdminCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      page = "1",
      limit = "10",
      sortBy = "createdAt",
      sortOrder = "asc",
      specialty,
      isApproved,
      search,
    } = req.query as Record<string, string>;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const matchStage: any = {};

    if (specialty) {
      const specialtyList = specialty
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      matchStage.specialty =
        specialtyList.length > 1 ? { $in: specialtyList } : specialtyList[0];
    }

    if (isApproved !== undefined) {
      matchStage.isApproved = isApproved === "true";
    }

    const sortFieldMap: Record<string, string> = {
      name: "_userName",
      email: "_userEmail",
    };
    const resolvedSortField = sortFieldMap[sortBy] ?? sortBy;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const pipeline: any[] = [
      { $match: matchStage },
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
        $lookup: {
          from: "doctorschedules",
          localField: "_id",
          foreignField: "doctorId",
          as: "schedule",
        },
      },
      {
        $unwind: {
          path: "$schedule",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (search) {
      pipeline.push({
        $match: {
          "user.email": { $regex: search, $options: "i" },
        },
      });
    }

    pipeline.push({
      $addFields: {
        _userName: "$user.name",
        _userEmail: "$user.email",
      },
    });

    pipeline.push({
      $sort: { [resolvedSortField]: sortDirection },
    });

    pipeline.push({
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limitNumber },
          {
            $project: {
              _id: 1,
              about: 1,
              address: 1,
              degree: 1,
              specialty: 1,
              experience: 1,
              fees: 1,
              isApproved: 1,
              createdAt: 1,
              updatedAt: 1,
              slotDuration: "$schedule.slotDuration",
              workingDays: "$schedule.workingDays",

              userId: {
                _id: "$user._id",
                name: "$user.name",
                email: "$user.email",
                avatar: "$user.avatar",
                roles: "$user.roles",
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    });

    const result = await Doctor.aggregate(pipeline);
    const doctors = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    res.status(200).json({
      data: doctors,
      meta: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

// delete doctor
export const deleteDoctorCtrl = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    if (!doctor) return next(createError(404, "Doctor not found"));
    await DoctorSchedule.findOneAndDelete({ doctorId: doctor._id });
    const user = await User.findById(doctor.userId);
    if (!user) return next(createError(404, "User not found"));

    const newRoles = user?.roles.filter((role) => role !== "doctor");

    user.roles = newRoles;

    await user.save();

    await Doctor.findByIdAndDelete(id);

    res.status(200).json({ message: "Doctor Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

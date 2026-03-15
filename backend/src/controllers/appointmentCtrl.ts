import { NextFunction, Request, Response } from "express";
import DoctorSchedule from "../models/doctorScheduleModel";
import {
  BREAK_END,
  BREAK_START,
  CLINIC_END,
  CLINIC_START,
  createError,
  formatDhakaDate,
  getDhakaDateNow,
  getDhakaToday,
  getPaymentExpiryTime,
  isToday,
  nowInMinutes,
} from "../lib/utils";

import { AuthenticatedRequest } from "../lib/types";
import { Appointment } from "../models/appointmentModel";
import { Doctor } from "../models/doctorModel";

// get next 5 working days of the specified doctor
export const getNextWorkingDays = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { doctorId } = req.params;

    const schedule = await DoctorSchedule.findOne({ doctorId }).lean();

    if (!schedule) {
      return next(createError(404, "Doctor schedule not found"));
    }

    const days: string[] = [];

    const current = getDhakaDateNow();

    if (nowInMinutes() >= CLINIC_START) {
      current.setDate(current.getDate() + 1);
    }

    while (days.length < 5) {
      const weekDay = current.getDay();

      if (schedule.workingDays?.includes(weekDay)) {
        days.push(formatDhakaDate(current));
      }

      current.setDate(current.getDate() + 1);
    }

    res.status(200).json(days);
  } catch (error) {
    next(error);
  }
};

// updating unpaid expired appointments
const expireStaleAppointments = async (doctorId: string, date: string) => {
  const now = getDhakaDateNow();
  await Appointment.updateMany(
    {
      doctorId,
      date,
      status: "pending",
      paymentStatus: "unpaid",
      paymentExpiresAt: { $lt: now },
    },
    { $set: { status: "cancelled", paymentStatus: "expired" } },
  );
};

// getting available slots for a specified doctor on a date
export const getAvailableSlots = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctorId = req.query.doctorId as string;
    const date = req.query.date as string;

    if (!doctorId || !date) {
      return next(createError(400, "doctorId and date are required"));
    }

    await expireStaleAppointments(doctorId, date);

    const schedule = await DoctorSchedule.findOne({ doctorId }).lean();

    if (!schedule) {
      return next(createError(404, "Doctor schedule not found"));
    }

    const duration = schedule.slotDuration;

    const bookedAppointments = await Appointment.find({
      doctorId,
      date,
      status: {
        $in: ["pending", "confirmed"],
      },
    })
      .select("startMinute")
      .lean();

    const bookedSet = new Set(bookedAppointments.map((b) => b.startMinute));

    const slots: {
      startMinute: number;
      endMinute: number;
    }[] = [];

    const generateSlots = (start: number, end: number) => {
      let current = start;
      while (current + duration <= end) {
        const isBooked = bookedSet.has(current);
        const isPast = isToday(date) && current <= nowInMinutes();

        if (!isBooked && !isPast) {
          slots.push({
            startMinute: current,
            endMinute: current + duration,
          });
        }

        current += duration;
      }
    };

    generateSlots(CLINIC_START, BREAK_START);
    generateSlots(BREAK_END, CLINIC_END);

    res.status(200).json(slots);
  } catch (error) {
    next(error);
  }
};

// create new appointment
export const createAppointment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      doctorId,
      patientId,
      date,
      startMinute,
      endMinute,
      symptoms,
      paymentAmount,
    } = req.body;

    if (patientId.toString() !== req.user?._id.toString()) {
      return next(
        createError(
          403,
          "You cannot create an appointment for another patient",
        ),
      );
    }

    const schedule = await DoctorSchedule.findOne({ doctorId }).lean();

    if (!schedule) {
      return next(createError(404, "Doctor schedule not found"));
    }

    const duration = schedule.slotDuration;

    if (endMinute - startMinute !== duration) {
      return next(createError(400, "Invalid slot duration"));
    }

    const isInsideClinicTime =
      (startMinute >= CLINIC_START && endMinute <= BREAK_START) ||
      (startMinute >= BREAK_END && endMinute <= CLINIC_END);

    if (!isInsideClinicTime) {
      return next(createError(400, "Invalid Time Slot"));
    }

    if (isToday(date) && startMinute <= nowInMinutes()) {
      return next(createError(400, "This slot has already passed"));
    }

    const today = new Date(getDhakaToday());
    const selectedDate = new Date(date);

    if (selectedDate < today) {
      return next(createError(400, "Cannot book past appointments"));
    }

    const weekDay = selectedDate.getDay();

    if (!schedule.workingDays?.includes(weekDay)) {
      return next(createError(400, "Doctor is not available on this day"));
    }

    const paymentExpiresAt = getPaymentExpiryTime();

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date,
      startMinute,
      endMinute,
      symptoms,
      paymentAmount,
      paymentExpiresAt,
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    if (error.code === 11000) {
      return next(createError(409, "Slot already booked"));
    }
    next(error);
  }
};

// getting appointments of a particular patient
export const getMyAppointmentsAsPatient = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patientId = req.user?._id;
    const now = getDhakaDateNow();
    await Appointment.updateMany(
      {
        patientId,
        status: "pending",
        paymentStatus: "unpaid",
        paymentExpiresAt: { $lt: now },
      },
      { $set: { status: "cancelled", paymentStatus: "expired" } },
    );

    const appointments = await Appointment.find({ patientId })
      .populate({
        path: "doctorId",
        select: "userId specialty",
        populate: {
          path: "userId",
          select: "name avatar",
        },
      })
      .sort({ date: -1, startMinute: -1 })
      .lean();

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// get a doctor's appointemts
export const getMyAppointmentsAsDoctor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?._id;
    const doctorProfile = await Doctor.findOne({ userId }).lean();

    if (!doctorProfile) {
      return next(createError(404, "Doctor profile not found for this user"));
    }

    const appointments = await Appointment.find({
      doctorId: doctorProfile._id,
      status: "confirmed",
      paymentStatus: "paid",
    })
      .populate({
        path: "patientId",
        select: "name avatar",
      })
      .sort({ date: -1, startMinute: -1 })
      .lean();

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

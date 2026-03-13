import { NextFunction, Request, Response } from "express";
import { Appointment } from "../models/appointmentModel";
import { createError, getDhakaDateNow } from "../lib/utils";
import { createPayment, verifyPayment } from "../services/shurjoPayService";
import { AuthenticatedRequest } from "../lib/types";

// START PAYMENT
export const startPayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      status: "pending",
      paymentStatus: "unpaid",
    }).populate("patientId");

    if (!appointment)
      return next(createError(400, "Appointment already processed or expired"));

    // Check payment window
    if (
      appointment.paymentExpiresAt &&
      appointment.paymentExpiresAt.getTime() < getDhakaDateNow().getTime()
    ) {
      appointment.status = "cancelled";
      await appointment.save();
      return res.status(400).json({ message: "Payment window expired" });
    }

    const payment = await createPayment(
      appointmentId,
      Number(appointment.paymentAmount),
      req.user,
      req,
    );

    appointment.paymentTransactionId = payment.sp_order_id;
    await appointment.save();

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

// PAYMENT CALLBACK
export const paymentCallback = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const order_id = req.query.order_id as string;

    if (!order_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    const verification = await verifyPayment(order_id);

    if (!verification || !verification.length) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    const paymentInfo = verification[0];

    const appointment = await Appointment.findOne({
      paymentTransactionId: order_id,
    });

    if (!appointment) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    // already paid
    if (appointment.paymentStatus === "paid") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/payment-success?txn_id=${order_id}`,
      );
    }

    // payment window expired
    if (
      appointment.paymentExpiresAt &&
      appointment.paymentExpiresAt.getTime() < getDhakaDateNow().getTime()
    ) {
      appointment.status = "cancelled";
      appointment.paymentStatus = "expired";
      await appointment.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/payment-expired?txn_id=${order_id}`,
      );
    }

    const isPaymentSuccessful =
      paymentInfo.bank_status === "Success" ||
      paymentInfo.sp_message === "Success" ||
      paymentInfo.sp_code === "1000";

    if (isPaymentSuccessful) {
      appointment.paymentStatus = "paid";
      appointment.status = "confirmed";
      await appointment.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/payment-success?txn_id=${order_id}`,
      );
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/payment-failed?txn_id=${order_id}`,
    );
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { txn_id } = req.query as { txn_id: string };

    if (!txn_id) {
      return next(createError(400, "txn_id is required"));
    }

    const appointment = await Appointment.findOne({
      paymentTransactionId: txn_id,
      patientId: req.user?._id, // ensures only the owner can query
    })
      .select("paymentStatus status")
      .lean();

    if (!appointment) {
      return next(createError(404, "Appointment not found"));
    }

    res.status(200).json({
      paymentStatus: appointment.paymentStatus, // "paid" | "unpaid" | "expired"
      appointmentStatus: appointment.status, // "confirmed" | "cancelled" | "pending"
    });
  } catch (error) {
    next(error);
  }
};

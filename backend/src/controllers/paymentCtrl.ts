import { NextFunction, Request, Response } from "express";
import { Appointment } from "../models/appointmentModel";
import { createError, getDhakaDateNow } from "../lib/utils";
import { createPayment, verifyPayment } from "../services/shurjoPayService";
import { AuthenticatedRequest } from "../lib/types";
import { IUser } from "../models/userModel";

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

    console.log("order_id:", order_id);

    if (!order_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    const verification = await verifyPayment(order_id);

    console.log("verification:", verification);

    if (!verification || !verification.length) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    const paymentInfo = verification[0];

    console.log("paymentInfo:", paymentInfo);

    const appointment = await Appointment.findOne({
      paymentTransactionId: order_id,
    });

    console.log("appointment:", appointment?._id);

    if (!appointment) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
    }

    // already paid
    if (appointment.paymentStatus === "paid") {
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/payment-success`,
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
        `${process.env.FRONTEND_URL}/payment/payment-expired`,
      );
    }

    /**
     * IMPORTANT:
     * Sandbox success conditions
     */
    const isPaymentSuccessful =
      paymentInfo.bank_status === "Success" ||
      paymentInfo.sp_message === "Success" ||
      paymentInfo.sp_code === "1000";

    if (isPaymentSuccessful) {
      appointment.paymentStatus = "paid";
      appointment.status = "confirmed";

      await appointment.save();

      console.log("Payment confirmed for:", appointment._id);

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment/payment-success`,
      );
    }

    console.log("Payment failed condition hit");

    return res.redirect(`${process.env.FRONTEND_URL}/payment/payment-failed`);
  } catch (error) {
    next(error);
  }
};

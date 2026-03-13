import cron from "node-cron";
import { Appointment } from "../models/appointmentModel";
import { getDhakaDateNow } from "../lib/utils";

export const startCleanupWorker = () => {
  cron.schedule("*/2 * * * *", async () => {
    const now = getDhakaDateNow();
    const expiredAppointments = await Appointment.find({
      status: "pending",
      paymentStatus: "unpaid",
      paymentExpiresAt: { $lt: now },
    });

    for (const appointment of expiredAppointments) {
      appointment.status = "cancelled";
      appointment.paymentStatus = "expired";
      await appointment.save();
    }
  });
};

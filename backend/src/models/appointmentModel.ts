import { Schema, model, Types } from "mongoose";

export interface IAppointment {
  doctorId: Types.ObjectId | string;
  patientId: Types.ObjectId | string;
  symptoms: string;
  date: string; // YYYY-MM-DD
  startMinute: number; // minutes from midnight (0–1439)
  endMinute: number; // minutes from midnight (1–1440)
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },

    symptoms: {
      type: String,
      maxLength: [200, "Symptoms decription can not exceed 200 characters"],
    },

    startMinute: {
      type: Number,
      required: [true, "Start time is required"],
    },

    endMinute: {
      type: Number,
      required: [true, "End time is required"],
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
  },
  { timestamps: true },
);

//  Prevent double booking
//  Same doctor, same date, same slot

appointmentSchema.index(
  { doctorId: 1, date: 1, startMinute: 1 },
  { unique: true },
);

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema,
);

import { Schema, model, Types } from "mongoose";

export interface IDoctorSchedule {
  doctorId: Types.ObjectId | string;
  workingDays: number[]; // 0 (Sun) → 6 (Sat)
  slotDuration: 20 | 30;
}

const doctorScheduleSchema = new Schema<IDoctorSchedule>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },

    workingDays: {
      type: [Number],
      required: true,
      validate: {
        validator: function (days: number[]) {
          if (!Array.isArray(days)) return false;

          if (days.length < 2 || days.length > 6) return false;

          const uniqueDays = new Set(days);
          if (uniqueDays.size !== days.length) return false;

          return days.every(
            (day) => Number.isInteger(day) && day >= 0 && day <= 6,
          );
        },
        message:
          "Working days must be unique integers between 0 and 6 (2–6 days required)",
      },
    },

    slotDuration: {
      type: Number,
      enum: [20, 30],
      required: [true, "Slot duration is required"],
    },
  },
  { timestamps: true },
);

const DoctorSchedule = model<IDoctorSchedule>(
  "DoctorSchedule",
  doctorScheduleSchema,
);

export default DoctorSchedule;

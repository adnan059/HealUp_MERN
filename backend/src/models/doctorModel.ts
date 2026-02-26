import { Schema, model, Types } from "mongoose";

/**
 * Doctor Interface
 */
export interface IDoctor {
  userId: Types.ObjectId | string;
  specialty: string;
  degree: string;
  experience: number;
  about: string;
  fees: number;
  address: string;
  isApproved: boolean;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialty: {
      type: String,
      enum: [
        "cardiology",
        "rheumatology",
        "neurology",
        "pediatrics",
        "endocrinology",
        "dermatology",
        "nephrology",
        "orthopedics",
        "oncology",
      ],
      required: [true, "Specialty is required"],
    },

    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      minlength: [4, "Degree must be at least 2 characters"],
      maxlength: [300, "Degree cannot exceed 50 characters"],
    },

    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },

    about: {
      type: String,
      required: [true, "About is required"],
      trim: true,
      minlength: [20, "About must be at least 20 characters"],
      maxlength: [500, "About cannot exceed 500 characters"],
    },

    fees: {
      type: Number,
      required: [true, "Fees is required"],
      min: [0, "Fees cannot be negative"],
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Doctor = model<IDoctor>("Doctor", doctorSchema);

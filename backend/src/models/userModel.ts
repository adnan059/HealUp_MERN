import { Schema, model } from "mongoose";

/**
 * User Interface
 */
export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  roles: Array<"patient" | "doctor" | "admin">;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    avatar: {
      type: String,
    },

    roles: {
      type: [String],
      enum: ["patient", "doctor", "admin"],
      required: true,
      default: ["patient"],
    },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);

export default User;

import { param } from "express-validator";
import { Types } from "mongoose";

export const monoIdParam = (paramName: string) =>
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .custom((value) => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${paramName}`);
      }
      return true;
    });

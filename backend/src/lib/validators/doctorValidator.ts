import { body, query } from "express-validator";

const specialties = [
  "cardiology",
  "rheumatology",
  "neurology",
  "pediatrics",
  "endocrinology",
  "dermatology",
  "nephrology",
  "orthopedics",
  "oncology",
];

// doctor account create validator
export const createDoctorValidator = [
  // specialty
  body("specialty")
    .notEmpty()
    .withMessage("Specialty is required")
    .isIn(specialties)
    .withMessage("Invalid specialty"),

  // degree
  body("degree")
    .trim()
    .notEmpty()
    .withMessage("Degree is required")
    .isLength({ min: 4, max: 300 })
    .withMessage("Degree must be between 4 and 300 characters"),

  // experience
  body("experience")
    .notEmpty()
    .withMessage("Experience is required")
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative number"),

  // about
  body("about")
    .trim()
    .notEmpty()
    .withMessage("About is required")
    .isLength({ min: 20, max: 500 })
    .withMessage("About must be between 20 and 500 characters"),

  // fees
  body("fees")
    .notEmpty()
    .withMessage("Fees is required")
    .isFloat({ min: 0 })
    .withMessage("Fees must be a non-negative number"),

  // address
  body("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),

  // workingDays
  body("workingDays")
    .isArray({ min: 2, max: 6 })
    .withMessage("Working days must be an array of 2 to 6 days")
    .custom((days: number[]) => {
      const uniqueDays = new Set(days);
      if (uniqueDays.size !== days.length) return false;

      return days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6);
    })
    .withMessage("Working days must be unique integers between 0 and 6"),

  // slotDuration
  body("slotDuration")
    .notEmpty()
    .withMessage("Slot duration is required")
    .isIn([20, 30])
    .withMessage("Slot duration must be 20 or 30 minutes"),
];

export const getAllDoctorsForAdminValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),

  query("sortBy")
    .optional()
    .isIn([
      "name",
      "email",
      "specialty",
      "experience",
      "isApproved",
      "createdAt",
    ]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("specialty").optional().isString(),
  query("isApproved").optional().isBoolean().toBoolean(),
  query("search").optional().isString(),
];

// handle doctor account approval validator
export const doctorApprovalValidator = [
  body("isApproved")
    .notEmpty()
    .withMessage("isApproved is required")
    .isBoolean()
    .withMessage("isApproved must be a boolean")
    .toBoolean(),
];

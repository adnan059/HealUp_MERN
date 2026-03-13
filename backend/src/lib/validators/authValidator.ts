import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("roles")
    .optional()
    .isArray()
    .withMessage("Roles must be an array")
    .bail()
    .custom((roles: string[]) => {
      const allowed = ["patient", "doctor", "admin"];
      const isValid = roles.every((r) => allowed.includes(r));
      if (!isValid) {
        throw new Error("Roles must only contain patient, doctor, or admin");
      }
      return true;
    }),

  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string")
    .isURL({ require_protocol: true })
    .withMessage("Avatar must be a valid URL"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password").notEmpty().withMessage("Password is required"),
];

export const updateAvatarValidator = [
  body("avatar")
    .notEmpty()
    .isString()
    .withMessage("Avatar must be a string")
    .isURL({ require_protocol: true })
    .withMessage("Avatar must be a valid URL"),
];

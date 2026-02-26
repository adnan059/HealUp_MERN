import { NextFunction, Request, Response } from "express";
import { createError } from "../lib/utils";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../lib/types";

// verify token
export const verifyToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.jwt_token;

    if (!token) {
      return next(createError(401, "Unauthorized"));
    }

    const jwtSecret = process.env.JWT_SK;
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string | Types.ObjectId;
    };

    if (!decoded) {
      return next(createError(401, "invalid token"));
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(createError(404, "user not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

//verify admin
export const verifyAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.user && req.user.roles.includes("admin")) {
      return next();
    }

    return next(createError(401, "Unauthorized"));
  } catch (error) {
    next(error);
  }
};

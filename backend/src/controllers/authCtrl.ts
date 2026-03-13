import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { createError, generateToken, tokenCookieOptions } from "../lib/utils";
import bcrypt from "bcryptjs";
import {
  AuthenticatedRequest,
  ILoginUserReqBody,
  IRegisterUserReqBody,
} from "../lib/types";
import { Types } from "mongoose";

// register controller
export const registerCtrl = async (
  req: Request<{}, {}, IRegisterUserReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, avatar } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return next(createError(409, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: avatar || "",
      roles: ["patient"],
    });

    const token = generateToken(newUser._id as Types.ObjectId);

    const { password: _, ...userData } = newUser.toObject();

    res
      .status(201)
      .cookie("jwt_token", token, tokenCookieOptions)
      .json({ ...userData });
  } catch (error) {
    next(error);
  }
};

// login controller
export const loginCtrl = async (
  req: Request<{}, {}, ILoginUserReqBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(createError(401, "Invalid credentials"));
    }

    const token = generateToken(user._id as Types.ObjectId);

    const { password: _, ...userData } = user.toObject();

    res
      .status(200)
      .cookie("jwt_token", token, tokenCookieOptions)
      .json({ ...userData });
  } catch (error) {
    next(error);
  }
};

// logout controller
export const logoutCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res
      .status(200)
      .clearCookie("jwt_token", {
        ...tokenCookieOptions,
        maxAge: undefined,
      })
      .json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// get current user controller
export const getCurrentUserCtrl = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

// update avatar controller
export const updateAvatarCtrl = async (
  req: AuthenticatedRequest<{ avatar: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return next(createError(400, "Avatar URL is required"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      { avatar },
      { new: true, select: "-password" },
    );

    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

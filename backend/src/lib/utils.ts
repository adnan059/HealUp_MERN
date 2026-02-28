import { Types } from "mongoose";
import { AppError } from "./types";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";

export const createError = (statusCode: number, message: string): AppError => {
  let err = new Error(message) as AppError;
  err.status = statusCode;
  return err;
};

export const generateToken = (id: Types.ObjectId | string): string => {
  if (!process.env.JWT_SK) {
    throw new Error("Failed to create token");
  }

  return jwt.sign(
    {
      id: id.toString(),
    },
    process.env.JWT_SK,
    { expiresIn: "7d" },
  );
};

export const tokenCookieOptions: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
};

export const CLINIC_START = 10 * 60;
export const CLINIC_END = 18 * 60;

export const BREAK_START = 13 * 60;
export const BREAK_END = 14 * 60;

export const TOTAL_WORKING_MINUTES =
  CLINIC_END - CLINIC_START - (BREAK_END - BREAK_START);

export const getDhakaDateNow = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })); // Wed Feb 25 2026 23:54:14 GMT+0600 (Bangladesh Standard Time)

export const nowInMinutes = () => {
  const now = getDhakaDateNow();
  return now.getHours() * 60 + now.getMinutes(); // 600 420 900 etc
};

export const formatDhakaDate = (date: Date) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" }); // '2026-02-25'

export const getDhakaToday = () => formatDhakaDate(getDhakaDateNow()); // '2026-02-25'

export const isToday = (date: string) => {
  return getDhakaToday() === date;
};

export const getPaymentExpiryTime = () => {
  const nowDhaka = getDhakaDateNow();

  return new Date(
    nowDhaka.getTime() + Number(process.env.PAYMENT_WINDOW_MINUTES) * 60 * 1000,
  );
};

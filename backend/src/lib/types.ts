import { Request } from "express";
import { IUser } from "../models/userModel";
import { Types } from "mongoose";

export interface AppError extends Error {
  status?: number;
}

export interface IRegisterUserReqBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface ILoginUserReqBody {
  email: string;
  password: string;
}

export interface AuthenticatedRequest<
  Body = any,
  Params = any,
  Query = any,
> extends Request<Params, any, Body, Query> {
  user?: IUser & { _id: Types.ObjectId | string };
}

export interface ICreateDoctorReqBody {
  specialty: string;
  degree: string;
  experience: number;
  about: string;
  fees: number;
  address?: string;
  workingDays: number[];
  slotDuration: 20 | 30;
}

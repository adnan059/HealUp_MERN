import type { specialties } from "@/lib";

export interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  doctorProfile: IDoctorDetailsWithSchedule | null;
}

export type RegisterFormValuesType = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormValuesType = {
  email: string;
  password: string;
};

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  roles: ("patient" | "doctor" | "admin")[];
}

export interface IDoctor {
  _id: string;
  specialty: DoctorSpecialty;
  degree: string;
  experience: number;
  about: string;
  fees: number;
  address: string;
  isApproved: boolean;
  userId: IUser;
  createdAt: string;
  updatedAt: string;
}

export type DoctorSpecialty = (typeof specialties)[number];

export type SortOption = "fees_high" | "fees_low" | "exp_high" | "exp_low";

export interface IFetchAllDoctors {
  specialty: string;
  sort: string;
  page: string;
}

export interface IAllDoctors {
  data: IDoctor[];
  total: number;
  page: number;
  totalPages: number;
}

export type FeaturedDoctorsType = IDoctor[];

// same as IDoctor in chatgpt
export interface IDoctorDetailsWithSchedule {
  _id: string;
  doctorId: string;
  userId: IUser;
  about: string;
  address: string;
  degree: string;
  specialty: DoctorSpecialty;
  experience: number;
  fees: number;
  isApproved: boolean;
  slotDuration: 20 | 30;
  workingDays: number[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreateDoctorData {
  specialty: DoctorSpecialty;
  degree: string;
  experience: number;
  about: string;
  fees: number;
  address?: string;
  workingDays: number[];
  slotDuration: 20 | 30;
}

export interface ICreateAppointmentData {
  doctorId: string;
  patientId: string;
  date: string;
  startMinute: number;
  endMinute: number;
  symptoms: string;
  paymentAmount: number;
}

export interface IAppointmentDetails extends ICreateAppointmentData {
  _id: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentExpiresAt: Date;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllDoctorsForAdminParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  specialty?: string;
  isApproved?: boolean;
  search?: string;
}

export interface IAdminDoctorsResponse {
  data: IDoctorDetailsWithSchedule[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type AdminDashboardFilters = {
  search: string;
  specialty: string[];
  isApproved: "all" | "true" | "false";
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
};

export type SlotType = { startMinute: number; endMinute: number };

export interface IPaymentStatusResponse {
  paymentStatus: "paid" | "unpaid" | "expired";
  appointmentStatus: "confirmed" | "cancelled" | "pending";
}

export interface IPatientAppointment {
  _id: string;
  doctorId: {
    _id: string;
    specialty: string;
    userId: {
      _id: string;
      name: string;
      avatar: string;
    };
  };
  patientId: string;
  date: string;
  startMinute: number;
  endMinute: number;
  symptoms: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "expired";
  paymentAmount: number;
  paymentTransactionId?: string;
  paymentExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDoctorAppointment {
  _id: string;
  doctorId: string;
  patientId: {
    _id: string;
    name: string;
    avatar: string;
  };
  date: string;
  startMinute: number;
  endMinute: number;
  symptoms: string;
  status: "confirmed"; // only confirmed shown
  paymentStatus: "paid"; // only paid shown
  paymentAmount: number;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarUploaderProps {
  currentAvatar: string;
  userName: string;
}

import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { workingDaysList } from ".";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleAxiosError = (error: unknown) => {
  const fallbackMessage = "Something Went Wrong";
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || fallbackMessage);
  } else {
    console.log("Non-Axios Error:", error);
    toast.error(fallbackMessage);
  }
};

export const formatDate = (date: string) => {
  const d = new Date(date);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    weekday: "long",
  });
};

export const formatTime = (minute: number) => {
  const h = Math.floor(minute / 60); // 15
  const m = minute % 60; // 20

  const hour12 = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";

  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

export const getAvatatFallbackText = (fullName: string) => {
  const partsOfName = fullName.split(" ");
  const firstLetterOfFirstName = partsOfName[0]
    ?.slice(0, 1)
    .toLocaleUpperCase();
  const firstLetterOfSecondName = partsOfName[1]?.slice(0, 1).toUpperCase();
  if (firstLetterOfSecondName) {
    return firstLetterOfFirstName + firstLetterOfSecondName;
  }
  return firstLetterOfFirstName;
};

export const getWorkinDays = (days: Array<number>) => {
  let text = "";
  days.forEach((day) => {
    workingDaysList.forEach((wd) => {
      if (wd.value === day) {
        text += wd.label + ", ";
      }
    });
  });
  return text.slice(0, -2);
};

// ── helper ──────────────────────────────────────────────────────────────────
// Mirrors the backend's getDhakaDateNow() + nowInMinutes() logic.
// Gets the current date string (YYYY-MM-DD) and current minute-of-day
// both expressed in Asia/Dhaka timezone, so past/future judgment is
// consistent with how the backend generates and validates appointment slots.

export const getDhakaNow = (): { todayStr: string; nowMinute: number } => {
  // toLocaleString with Asia/Dhaka gives us a Date object whose
  // local time reflects Dhaka time — same technique as the backend utils.ts
  const dhakaDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
  );

  // YYYY-MM-DD via en-CA locale (same as backend's formatDhakaDate)
  const todayStr = dhakaDate.toLocaleDateString("en-CA", {
    timeZone: "Asia/Dhaka",
  });

  const nowMinute = dhakaDate.getHours() * 60 + dhakaDate.getMinutes();

  return { todayStr, nowMinute };
};

// Returns true if the appointment slot has already passed in Dhaka time.
// An appointment is "past" when:
//   - its date is before today, OR
//   - its date is today AND its startMinute <= current minute
export const isAppointmentPast = (
  date: string,
  startMinute: number,
  todayStr: string,
  nowMinute: number,
): boolean => {
  if (date < todayStr) return true;
  if (date === todayStr && startMinute <= nowMinute) return true;
  return false;
};

export const uploadToCloudinary = async (file: File): Promise<string> => {
  console.log("UP", UPLOAD_PRESET);
  console.log("CN", CLOUD_NAME);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "healup/avatars");

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
    );
    return data.secure_url as string;
  } catch (error) {
    console.log(error);
    throw new Error("Cloudinary upload failed");
  }
};

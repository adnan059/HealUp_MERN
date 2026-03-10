import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { workingDaysList } from ".";

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

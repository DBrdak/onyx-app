import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addHours,
  endOfWeek,
  isAfter,
  isBefore,
  isEqual,
  startOfWeek,
  subYears,
} from "date-fns";

import { USER_LOCALE } from "./constants/locale";
import { AxiosError } from "axios";
import { ZodSchema } from "zod";
import { ExtendedResult } from "./validation/base";
import { DateRange } from "react-day-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  const defaultMessage = "Something went wrong. Please try again.";

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const customMessage = error.response?.data?.error?.message;

    if (status === 400 && customMessage) {
      return customMessage;
    }

    switch (status) {
      case 404:
        return "Resource not found.";
      case 500:
        return "Server error. Please try again later.";
    }
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
};

export const validateResponse = <T>(
  zodSchema: ZodSchema<ExtendedResult<T>>,
  data: T,
) => {
  const validatedResponse = zodSchema.safeParse(data);

  if (validatedResponse.error) {
    console.log(validatedResponse.error.errors);
    throw new Error("Unexpected error, please try again.");
  }

  if (validatedResponse.data.isFailure) {
    const error = validatedResponse.data.error.message;
    console.log(error);
    throw new Error(error);
  }

  return validatedResponse.data.value;
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFormattedCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat(USER_LOCALE, {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatToDotDecimal = (str: string): string => {
  const index = str.indexOf(",");

  if (index !== -1) {
    return str.substring(0, index) + "." + str.substring(index + 1);
  }

  return str;
};

export const formatToDecimalString = (num: number) => {
  return num.toFixed(2);
};

export const isCurrentDate = (month: string, year: string) =>
  Number(month) === new Date().getMonth() + 1 &&
  Number(year) === new Date().getFullYear();

export const convertSecondsToDaysHours = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);

  if (days > 0) {
    return `${days} day${days > 1 ? "s and" : "and"} ${hours} hour${hours > 1 ? "s." : "."}`;
  } else {
    return `${hours} hour${hours > 1 ? "s." : "."}`;
  }
};

export const getWeekRange = (date: Date): DateRange => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { from: start, to: end };
};

export const isValidIsoDate = (isoString: Date | string): boolean => {
  if (isoString instanceof Date) {
    return !isNaN(isoString.getTime());
  }

  if (typeof isoString === "string") {
    const parsedDate = new Date(isoString);
    return !isNaN(parsedDate.getTime());
  }
  return false;
};

export const convertToLocal = (utcString: string | Date): Date => {
  if (!isValidIsoDate(utcString)) {
    throw new Error("Invalid date input.");
  }

  return new Date(utcString);
};

export const isInPastRange = (
  date: Date | string,
  rangeInYears: number,
): boolean => {
  const standardizedDate = new Date(date);

  if (isNaN(standardizedDate.getTime())) {
    return false;
  }

  const now = new Date();
  const earliestAllowedDate = subYears(now, rangeInYears);

  return (
    (isBefore(standardizedDate, now) || isEqual(standardizedDate, now)) &&
    (isAfter(standardizedDate, earliestAllowedDate) ||
      isEqual(standardizedDate, earliestAllowedDate))
  );
};

export const convertLocalToISOString = (
  localDateInput: string | Date,
): string => {
  // If the input is a string, parse it as a Date object
  const localDate: Date =
    typeof localDateInput === "string"
      ? new Date(localDateInput)
      : localDateInput;

  // Get the timezone offset in minutes
  const timezoneOffset: number = localDate.getTimezoneOffset(); // Offset in minutes

  // Convert the offset to hours
  const offsetHours: number = timezoneOffset / 60;

  // Adjust the date to "simulate" UTC by adding the offset hours
  const utcDate: Date = addHours(localDate, -offsetHours);

  // Return the ISO string representation of the UTC date
  return utcDate.toISOString();
};

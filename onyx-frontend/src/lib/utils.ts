import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { USER_LOCALE } from "./constants/locale";
import { AxiosError } from "axios";
import { ZodSchema } from "zod";
import { ExtendedResult } from "./validation/base";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  const message = "Something went wrong";

  if (error instanceof AxiosError) {
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    } else if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const err = error as { message: unknown };
    if (typeof err.message === "string") {
      return err.message;
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return message;
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

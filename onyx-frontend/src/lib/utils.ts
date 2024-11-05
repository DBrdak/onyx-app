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
  const defaultMessage = "Something went wrong. Please try again.";

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const customMessage = error.response?.data?.error?.message;

    if ((status === 400 || status === 401) && customMessage) {
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

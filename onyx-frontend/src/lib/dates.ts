import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subYears,
} from "date-fns";

type DateRange = {
  from: Date;
  to: Date;
};

export const convertToLocal = (utcString: string | Date): Date => {
  if (!isValidIsoDate(utcString)) {
    throw new Error("Invalid date input.");
  }

  return new Date(utcString);
};

export const formatDateToValidString = (date: Date | string): string => {
  const convertedDate = convertToLocal(date);

  return format(convertedDate, "yyyy-MM-dd'T'HH:mm:ssxxx");
};

export const getWeekRange = (date: Date): DateRange => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return {
    from: start,
    to: end,
  };
};

export const getMonthRange = (date: Date): DateRange => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return {
    from: start,
    to: end,
  };
};

export const getLastDays = (date: Date, days: number): DateRange => {
  const start = startOfDay(subDays(date, days));
  const end = endOfDay(date);
  return {
    from: start,
    to: end,
  };
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

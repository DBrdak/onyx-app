export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MIN_YEAR = 2024;
export const DEFAULT_MONTH_NUMBER = new Date().getMonth() + 1;
export const DEFAULT_MONTH_STRING = (new Date().getMonth() + 1).toString();
export const DEFAULT_YEAR_STRING = new Date().getFullYear().toString();
export const DEFAULT_YEAR_NUMBER = new Date().getFullYear();

export const DATE_PERIOD_OPTIONS = [
  "day",
  "week",
  "month",
  "range",
  "last7days",
  "last30days",
] as const;

export const DATE_PERIOD_SELECT = [
  {
    value: "day",
    label: "Day",
  },
  {
    value: "week",
    label: "Week",
  },
  {
    value: "month",
    label: "Month",
  },
  {
    value: "range",
    label: "Range",
  },
  {
    value: "last7days",
    label: "Last 7 days",
  },
  {
    value: "last30days",
    label: "Last 30 days",
  },
] as const;

export type DatePeriodValue = (typeof DATE_PERIOD_SELECT)[number]["value"];

export const DEFAULT_PERIOD_OPTION = "last30days";

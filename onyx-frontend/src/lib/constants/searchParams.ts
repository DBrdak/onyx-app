import { type SingleBudgetPageSearchParams } from "../validation/searchParams";
import {
  DEFAULT_ISO_DATE,
  DEFAULT_MONTH_STRING,
  DEFAULT_YEAR_STRING,
} from "./date";

export const SINGLE_BUDGET_DEFAULT_SEARCH_PARAMS: SingleBudgetPageSearchParams =
  {
    month: DEFAULT_MONTH_STRING,
    year: DEFAULT_YEAR_STRING,
    accDate: DEFAULT_ISO_DATE,
    accPeriod: "last30days",
    tableSize: "8",
  };

import { queryOptions } from "@tanstack/react-query";
import { budgetApi } from "../axios";
import { validateResponse } from "../utils";
import {
  CategoryStat,
  CategoryStatSchemaResult,
} from "../validation/statistics";

interface QueryParams {
  dateRangeStart: Date;
  dateRangeEnd: Date;
}

export const getStatistics = async (
  budgetId: string,
  { dateRangeEnd, dateRangeStart }: QueryParams,
) => {
  const fromMonth = (dateRangeStart.getMonth() + 1).toString();
  const fromYear = dateRangeStart.getFullYear().toString();
  const toMonth = (dateRangeEnd.getMonth() + 1).toString();
  const toYear = dateRangeEnd.getFullYear().toString();

  const params = {
    fromMonth,
    fromYear,
    toMonth,
    toYear,
  };

  const searchParams = new URLSearchParams(params);

  let url = `/${budgetId}/stats/categories`;

  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  const { data } = await budgetApi.get(url);

  const validatedData = validateResponse(CategoryStatSchemaResult, data);
  return validatedData.categoriesStats as CategoryStat[];
};

export const getCategoryStatsQueryOptions = (
  budgetId: string,
  searchParams: QueryParams,
) =>
  queryOptions({
    queryKey: ["categoryStats", budgetId],
    queryFn: () => getStatistics(budgetId, searchParams),
  });

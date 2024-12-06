import { queryOptions } from "@tanstack/react-query";

import { budgetApi } from "@/lib/axios";
import { validateResponse } from "@/lib/utils";
import {
  StatisticsSchemaResult,
  TStatisticsValueSchema,
} from "@/lib/validation/statistics";
import { queryBudgetKeys } from "./queryKeys";

export const getStatistics = async (budgetId: string) => {
  const { data } = await budgetApi.get(`/${budgetId}/stats`);

  const validatedData = validateResponse<TStatisticsValueSchema>(
    StatisticsSchemaResult,
    data,
  );
  return validatedData;
};

export const getStatisticsQueryOptions = (budgetId: string) =>
  queryOptions({
    queryKey: queryBudgetKeys.statistics(budgetId),
    queryFn: () => getStatistics(budgetId),
  });

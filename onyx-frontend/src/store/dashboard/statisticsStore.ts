import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfYear } from "date-fns";

import { createSelectors } from "@/store/createSelectors";

interface State {
  statisticsDateRangeStart: Date;
  statisticsDateRangeEnd: Date;
}

interface Actions {
  reset: () => void;
  setStatisticsDateRangeStart: (statisticsDateRangeStart: Date) => void;
  setStatisticsDateRangeEnd: (statisticsDateRangeEnd: Date) => void;
}

const DEFAULT_STATISTICS_STATE: State = {
  statisticsDateRangeStart: startOfYear(new Date()),
  statisticsDateRangeEnd: new Date(),
};

const statisticsStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...DEFAULT_STATISTICS_STATE,
      reset: () =>
        set(() => ({
          ...DEFAULT_STATISTICS_STATE,
        })),
      setStatisticsDateRangeEnd: (statisticsDateRangeEnd) =>
        set({ statisticsDateRangeEnd }),
      setStatisticsDateRangeStart: (statisticsDateRangeStart) =>
        set({ statisticsDateRangeStart }),
    }),
    {
      name: "statisticsStore",
    },
  ),
);

export const useStatisticsStore = createSelectors(statisticsStore);

export const useStatisticsDateRangeStart = () => {
  const dateRangeStartString =
    useStatisticsStore.use.statisticsDateRangeStart();
  return useMemo(() => new Date(dateRangeStartString), [dateRangeStartString]);
};
export const useStatisticsDateRangeEnd = () => {
  const dateRangeEndString = useStatisticsStore.use.statisticsDateRangeEnd();
  return useMemo(() => new Date(dateRangeEndString), [dateRangeEndString]);
};

export const getStatisticsDateRangeStart = () =>
  new Date(statisticsStore.getState().statisticsDateRangeStart);
export const getStatisticsDateRangeEnd = () =>
  new Date(statisticsStore.getState().statisticsDateRangeEnd);

export const resetStatisticsStore = () => statisticsStore.getState().reset();

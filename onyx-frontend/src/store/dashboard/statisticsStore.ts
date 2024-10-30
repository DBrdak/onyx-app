import { create } from "zustand";
import { startOfYear } from "date-fns";
import { persist } from "zustand/middleware";
import { useMemo } from "react";

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

export const useStatisticsStore = create<State & Actions>()(
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

export const useStatisticsDateRangeStart = () => {
  const dateRangeStartString = useStatisticsStore(
    (state) => state.statisticsDateRangeStart,
  );
  return useMemo(() => new Date(dateRangeStartString), [dateRangeStartString]);
};
export const useStatisticsDateRangeEnd = () => {
  const dateRangeEndString = useStatisticsStore(
    (state) => state.statisticsDateRangeEnd,
  );
  return useMemo(() => new Date(dateRangeEndString), [dateRangeEndString]);
};

export const useStatisticsActions = () => {
  const setStatisticsDateRangeStart = useStatisticsStore(
    (state) => state.setStatisticsDateRangeStart,
  );
  const setStatisticsDateRangeEnd = useStatisticsStore(
    (state) => state.setStatisticsDateRangeEnd,
  );
  const reset = useStatisticsStore((state) => state.reset);

  return {
    setStatisticsDateRangeStart,
    setStatisticsDateRangeEnd,
    reset,
  };
};

export const getStatisticsDateRangeStart = () =>
  new Date(useStatisticsStore.getState().statisticsDateRangeStart);
export const getStatisticsDateRangeEnd = () =>
  new Date(useStatisticsStore.getState().statisticsDateRangeEnd);

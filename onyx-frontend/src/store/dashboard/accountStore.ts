import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DatePeriodValue } from "@/lib/constants/date";
import { getLastDays } from "@/lib/dates";
import { useMemo } from "react";

interface State {
  accountId: string;
  accountSlug: string;
  accountPeriod: DatePeriodValue;
  accountDateRangeStart: Date;
  accountDateRangeEnd: Date;
  accountTableSize: number;
}

interface Actions {
  reset: () => void;
  initializeAccount: (accountId: string, accountSlug: string) => void;
  setAccountId: (accountId: string) => void;
  setAccountSlug: (accountSlug: string) => void;
  setAccountPeriod: (accountPeriod: DatePeriodValue) => void;
  setAccountDateRangeStart: (accountDateRangeStart: Date) => void;
  setAccountDateRangeEnd: (accountDateRangeEnd: Date) => void;
  setAccountTableSize: (accountTableSize: number) => void;
}

const DEFAULT_ACCOUNT_STATE: State = {
  accountId: "",
  accountSlug: "",
  accountPeriod: "last30days",
  accountDateRangeStart: getLastDays(new Date(), 30).from,
  accountDateRangeEnd: getLastDays(new Date(), 30).to,
  accountTableSize: 8,
};

export const useAccountStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...DEFAULT_ACCOUNT_STATE,
      reset: () =>
        set(() => ({
          ...DEFAULT_ACCOUNT_STATE,
        })),
      setAccountId: (accountId) => set({ accountId }),
      setAccountPeriod: (accountPeriod) => set({ accountPeriod }),
      setAccountDateRangeStart: (accountDateRangeStart) =>
        set({ accountDateRangeStart }),
      setAccountDateRangeEnd: (accountDateRangeEnd) =>
        set({ accountDateRangeEnd }),
      initializeAccount: (accountId, accountSlug) => {
        const currentAccountId = get().accountId;

        if (currentAccountId === accountId) return;

        set({ ...DEFAULT_ACCOUNT_STATE, accountId, accountSlug });
      },
      setAccountTableSize: (accountTableSize) => set({ accountTableSize }),
      setAccountSlug: (accountSlug) => set({ accountSlug }),
    }),
    {
      name: "accountStore",
    },
  ),
);

export const useAccountId = () => useAccountStore((state) => state.accountId);
export const useAccountPeriod = () =>
  useAccountStore((state) => state.accountPeriod);
export const useAccountDateRangeStart = () => {
  const dateString = useAccountStore((state) => state.accountDateRangeStart);
  return useMemo(() => new Date(dateString), [dateString]);
};
export const useAccountDateRangeEnd = () => {
  const dateString = useAccountStore((state) => state.accountDateRangeEnd);
  return useMemo(() => new Date(dateString), [dateString]);
};
export const useAccountTableSize = () =>
  useAccountStore((state) => state.accountTableSize);

export const useAccountActions = () => {
  const setAccountId = useAccountStore((state) => state.setAccountId);
  const setAccountPeriod = useAccountStore((state) => state.setAccountPeriod);
  const setAccountDateRangeStart = useAccountStore(
    (state) => state.setAccountDateRangeStart,
  );
  const setAccountDateRangeEnd = useAccountStore(
    (state) => state.setAccountDateRangeEnd,
  );
  const reset = useAccountStore((state) => state.reset);
  const setAccountTableSize = useAccountStore(
    (state) => state.setAccountTableSize,
  );

  return {
    setAccountId,
    setAccountPeriod,
    setAccountDateRangeStart,
    setAccountDateRangeEnd,
    reset,
    setAccountTableSize,
  };
};

export const getAccountId = () => useAccountStore.getState().accountId;
export const getAccountPeriod = () => useAccountStore.getState().accountPeriod;
export const getAccountDateRangeStart = () =>
  new Date(useAccountStore.getState().accountDateRangeStart);
export const getAccountDateRangeEnd = () =>
  new Date(useAccountStore.getState().accountDateRangeEnd);

export const initializeAccountId = useAccountStore.getState().initializeAccount;
export const setAccountSlug = useAccountStore.getState().setAccountSlug;

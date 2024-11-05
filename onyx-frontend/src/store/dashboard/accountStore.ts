import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DatePeriodValue } from "@/lib/constants/date";
import { getLastDays } from "@/lib/dates";
import { createSelectors } from "@/store/createSelectors";

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

export const accountStore = create<State & Actions>()(
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

export const useAccountStore = createSelectors(accountStore);

export const useAccountDateRangeStart = () => {
  const dateString = useAccountStore.use.accountDateRangeStart();
  return useMemo(() => new Date(dateString), [dateString]);
};
export const useAccountDateRangeEnd = () => {
  const dateString = useAccountStore.use.accountDateRangeEnd();
  return useMemo(() => new Date(dateString), [dateString]);
};

export const getAccountId = () => accountStore.getState().accountId;
export const getAccountPeriod = () => accountStore.getState().accountPeriod;
export const getAccountDateRangeStart = () =>
  new Date(accountStore.getState().accountDateRangeStart);
export const getAccountDateRangeEnd = () =>
  new Date(accountStore.getState().accountDateRangeEnd);

export const initializeAccountId = accountStore.getState().initializeAccount;
export const setAccountSlug = accountStore.getState().setAccountSlug;

export const resetAccountStore = () => accountStore.getState().reset();

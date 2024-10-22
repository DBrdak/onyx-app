import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DatePeriodValue, DEFAULT_ISO_DATE } from "@/lib/constants/date";

interface State {
  accountId: string;
  accountSlug: string;
  accountDate: string;
  accountPeriod: DatePeriodValue;
  accountDateRangeStart: string | null;
  accountDateRangeEnd: string | null;
  accountTableSize: number;
}

interface Actions {
  reset: () => void;
  initializeAccount: (accountId: string, accountSlug: string) => void;
  setAccountId: (accountId: string) => void;
  setAccountSlug: (accountSlug: string) => void;
  setAccountDate: (accountDate: string) => void;
  setAccountPeriod: (accountPeriod: DatePeriodValue) => void;
  setAccountDateRangeStart: (accountDateRangeStart: string | null) => void;
  setAccountDateRangeEnd: (accountDateRangeEnd: string | null) => void;
  setAccountTableSize: (accountTableSize: number) => void;
}

const DEFAULT_ACCOUNT_STATE: State = {
  accountId: "",
  accountSlug: "",
  accountDate: DEFAULT_ISO_DATE,
  accountPeriod: "last30days",
  accountDateRangeEnd: null,
  accountDateRangeStart: null,
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
      setAccountDate: (accountDate) => set({ accountDate }),
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
export const useAccountDate = () =>
  useAccountStore((state) => state.accountDate);
export const useAccountPeriod = () =>
  useAccountStore((state) => state.accountPeriod);
export const useAccountDateRangeStart = () =>
  useAccountStore((state) => state.accountDateRangeStart);
export const useAccountDateRangeEnd = () =>
  useAccountStore((state) => state.accountDateRangeEnd);
export const useAccountTableSize = () =>
  useAccountStore((state) => state.accountTableSize);

export const useAccountActions = () => {
  const setAccountId = useAccountStore((state) => state.setAccountId);
  const setAccountDate = useAccountStore((state) => state.setAccountDate);
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
    setAccountDate,
    setAccountPeriod,
    setAccountDateRangeStart,
    setAccountDateRangeEnd,
    reset,
    setAccountTableSize,
  };
};

export const getAccountId = () => useAccountStore.getState().accountId;
export const getAccountDate = () => useAccountStore.getState().accountDate;
export const getAccountPeriod = () => useAccountStore.getState().accountPeriod;
export const getAccountDateRangeStart = () =>
  useAccountStore.getState().accountDateRangeStart;
export const getAccountDateRangeEnd = () =>
  useAccountStore.getState().accountDateRangeEnd;

export const initializeAccountId = useAccountStore.getState().initializeAccount;
export const setAccountSlug = useAccountStore.getState().setAccountSlug;

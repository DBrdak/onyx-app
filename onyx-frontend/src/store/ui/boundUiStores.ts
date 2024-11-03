import { create } from "zustand";
import type { StateCreator } from "zustand";

const uiStoresResetFns = new Set<() => void>();

export const resetAllUiStores = () => {
  uiStoresResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const createUiStore = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = create(stateCreator);
    const initialState = store.getState();
    uiStoresResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof create;

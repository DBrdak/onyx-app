import { create as _create } from "zustand";
import type { StateCreator } from "zustand";

const allMemoryStoreResetFns = new Set<() => void>();

export const resetAllMemoryStores = () => {
  allMemoryStoreResetFns.forEach((resetFn) => {
    resetFn();
  });
};

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = _create(stateCreator);
    const initialState = store.getState();
    allMemoryStoreResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof _create;

import { type StateCreator } from "zustand";

export interface ICommonSlice {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const createCommonSlice: StateCreator<ICommonSlice> = (set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
});

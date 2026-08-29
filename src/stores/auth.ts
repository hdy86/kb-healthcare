import { type StateCreator } from "zustand";

export interface IAuthSlice {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const createAuthSlice: StateCreator<IAuthSlice> = (set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
});

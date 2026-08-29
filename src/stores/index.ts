import { create, useStore as useZustandStore } from "zustand";
import { createCommonSlice, type ICommonSlice } from "@stores/common";
import { createAuthSlice, type IAuthSlice } from "@stores/auth";

export type AppState = ICommonSlice & IAuthSlice;

export const store = create<AppState>()((...a) => ({
  ...createCommonSlice(...a),
  ...createAuthSlice(...a),
}));

const useStore = <T>(selector: (state: AppState) => T) => useZustandStore(store, selector);

export default useStore;

import { create } from "zustand";

export const useLoader = create((set) => ({
  loading: false,
  setLoading: (state) => set({ loading: state }),
}));

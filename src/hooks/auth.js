import { create } from "zustand";
import { resetApiHeaders } from "../Api/Axios";

export const useAuth = create((set) => ({
  isInitialised: false,
  isLoggedIn: false,
  userData: {},
  setLoggedIn: (state) => set({ isLoggedIn: state }),
  setUserData: (data) => set({ userData: data }),
  setInitialised: () => set({ isInitialised: true }),
  logout: () => {
    resetApiHeaders();
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("FB_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_DETAILS");
    localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_ID");
    set({ userData: {} });
    set({ isLoggedIn: false });
  },
}));

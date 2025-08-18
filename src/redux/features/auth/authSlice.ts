import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDTO } from "./authApi";

// 🍪 Cookie setup helper
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
};

// 🍪 Cookie to read data
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

// 🍪 Cookie delete
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export interface AuthState {
  token: string | null;
  user: UserDTO | null;
}

// 🔄 Initial State (Cookie take to token & LocalStorage take to  user)
const initialState: AuthState = {
  token: (typeof document !== "undefined" && getCookie("token")) || null,
  user:
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") as string)) ||
    null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token?: string; user?: UserDTO }>) => {
      const { token, user } = action.payload;

      if (token) {
        state.token = token;
        if (typeof document !== "undefined") setCookie("token", token, 7); // ✅ Cookie token valid for 7 days
      }

      if (user) {
        state.user = user;
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user)); // ✅ User for localStorage
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof document !== "undefined") deleteCookie("token"); // ✅ Cookie removed
      if (typeof localStorage !== "undefined") localStorage.removeItem("user"); // ✅ LocalStorage clear
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

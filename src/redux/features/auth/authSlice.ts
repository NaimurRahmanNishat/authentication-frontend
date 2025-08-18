import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDTO } from "./authApi";

export interface AuthState {
  token: string | null;
  user: UserDTO | null;
}

const initialState: AuthState = {
  token: (typeof localStorage !== "undefined" && localStorage.getItem("token")) || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ token?: string; user?: UserDTO }>) => {
      const { token, user } = action.payload;
      if (token) {
        state.token = token;
        if (typeof localStorage !== "undefined") localStorage.setItem("token", token);
      }
      if (user) state.user = user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof localStorage !== "undefined") localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
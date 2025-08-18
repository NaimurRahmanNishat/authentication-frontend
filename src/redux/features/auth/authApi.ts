/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBaseUrl } from "@/utils/getBaseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ApiMessage = string | Record<string, unknown>;
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: ApiMessage;
  data?: T;
  error?: string | null;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
}

export interface LoginVerifyResponse {
  token: string;
  id: string;
  username: string;
  email: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = typeof localStorage !== "undefined" ? localStorage.getItem('token') : null;
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        }
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // POST /api/auth/register
        register: builder.mutation<ApiResponse<UserDTO>, { username: string; email: string; password: string }>({
            query: (newUser) => ({
                url: '/register',
                method: 'POST',
                body: newUser
            })
        }),
        // POST /api/auth/login  (Step-1: sends OTP)
        login: builder.mutation<ApiResponse<{ email: string }>, { email: string; password: string }>({
            query: (body) => ({
                url: '/login',
                method: 'POST',
                body: body
            })
        }),
        // POST /api/auth/verify-otp  (Step-2: returns token + user)
        verifyOtp: builder.mutation<ApiResponse<LoginVerifyResponse>, { email: string; otpCode: string }>({
            query: (body) => ({
                url: "/verify-otp",
                method: "POST",
                body: body
            }),
            async onQueryStarted(_arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // persist token if it's in response (server also sets httpOnly cookie)
                    const token = (data?.data as any)?.token;
                    if (token && typeof localStorage !== "undefined") {
                        localStorage.setItem("token", token);
                    }
                } catch {
                    // no-op
                }
            },
            invalidatesTags: ["Auth"],
        }),
        // POST /api/auth/forgot-password (sends OTP via email)
        forgotPassword: builder.mutation<ApiResponse<undefined>, { email: string }>({
            query: (body) => ({
                url: "/forgot-password",
                method: "POST",
                body: body
            }),
        }),
        // POST /api/auth/reset-password
        resetPassword: builder.mutation<ApiResponse<undefined>, { email: string; otpCode: string; newPassword: string }>({
            query: (body) => ({
                url: "/reset-password",
                method: "POST",
                body: body
            }),
        }),
        // POST /api/auth/logout
        logout: builder.mutation<ApiResponse<undefined>, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),
    })
})

export const { useRegisterMutation, useLoginMutation, useVerifyOtpMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApi;
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
    message: string;
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
        // POST /api/auth/register (Step-1: sends OTP)
        register: builder.mutation<ApiResponse<UserDTO>, { username: string; email: string; password: string }>({
            query: (newUser) => ({
                url: '/register',
                method: 'POST',
                body: newUser
            })
        }),
        // POST /api/auth/verify-register-otp (Step-2: returns token + user)
        verifyRegisterOtp: builder.mutation<ApiResponse<UserDTO>, { email: string; otpCode: string }>({
            query: (body) => ({
                url: "/verify-register-otp",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth"],
        }),
        // POST /api/auth/login  (Step-1: sends OTP)
        login: builder.mutation<ApiResponse<{ message: string; email: string }>, { email: string; password: string }>({
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

export const { useRegisterMutation, useVerifyRegisterOtpMutation, useLoginMutation, useVerifyOtpMutation, useForgotPasswordMutation, useResetPasswordMutation, useLogoutMutation } = authApi;
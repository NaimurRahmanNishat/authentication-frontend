/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onSubmit = async ({ username, email, password }: RegisterFormData) => {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      const response = await registerUser({ username, email, password }).unwrap();
      if (response.success && response.data) {
        localStorage.setItem("pendingUser", JSON.stringify({ email: response.data.email || email }));
        setSuccessMessage(response.data.message || "OTP sent to your email. Please check and verify.");
        setTimeout(() => { navigate("/verify-register-otp") }, 1500);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error?.data?.message || error?.data?.error || "Invalid credentials. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-indigo-700">
          Welcome to Authentication
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Sign up to your account
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              {...register("username", { required: "Name is required" })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.username ? "border-red-500" : ""
                }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* error message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm text-center">{errorMessage}</p>
            </div>
          )}

          {/* success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm text-center">{successMessage}</p>
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 cursor-pointer rounded-lg text-white font-semibold transition-all duration-200 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 active:transform active:scale-98"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending OTP...
              </span>
            ) : (
              <span>Sign up</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage;
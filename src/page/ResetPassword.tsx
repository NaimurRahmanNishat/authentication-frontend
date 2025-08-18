/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";

type ResetInputs = {
  email: string;
  otpCode: string;
  newPassword: string;
};

const ResetPassword = () => {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<ResetInputs>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (data: ResetInputs) => {
    try {
      const res = await resetPassword(data).unwrap();
      console.log("✅ Reset Success:", res);
      setMessage("Password reset successful!");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("❌ Reset Error:", err);
      setError(err?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md mx-auto p-4 bg-white border-2 border-green-600 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mb-2"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded mb-2"
          {...register("otpCode", { required: "OTP is required" })}
        />
        {errors.otpCode && <p className="text-red-500">{errors.otpCode.message}</p>}

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full border p-2 rounded mb-2"
          {...register("newPassword", {
            required: "New password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
        {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default ResetPassword;

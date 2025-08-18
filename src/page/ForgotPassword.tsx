/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";

type ForgotInputs = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotInputs>();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async ({ email }: ForgotInputs) => {
    try {
      const res = await forgotPassword({ email }).unwrap();
      console.log("✅ Forgot Success:", res);
      setMessage("OTP sent to your email!");
      navigate("/reset-password");
      setError("");
    } catch (err: any) {
      console.error("❌ Forgot Error:", err);
      setError(err?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md mx-auto p-4 bg-white border-2 border-green-600 shadow rounded">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded mb-2"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

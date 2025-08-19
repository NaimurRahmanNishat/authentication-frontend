/* eslint-disable @typescript-eslint/no-explicit-any */
import { useVerifyRegisterOtpMutation } from "@/redux/features/auth/authApi";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type OtpInputs = {
  otpCode: string;
};

const RegisterOtp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendMessage] = useState("");
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<OtpInputs>();
  const [verifyOtp, { isLoading }] = useVerifyRegisterOtpMutation();
  const otpValue = watch("otpCode", "");

  useEffect(() => {
    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      try {
        const { email } = JSON.parse(pendingUser);
        setEmail(email);
      } catch (err) {
        console.error("Error parsing pending user:", err);
        navigate("/register");
      }
    } else {
      navigate("/register");
    }
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

const onSubmit = async ({ otpCode }: OtpInputs) => {
  try {
    setError("");
    setSuccessMessage("");
    const response = await verifyOtp({ email, otpCode }).unwrap();
    if (response.success && response.data) {
      localStorage.removeItem("pendingUser");
      setSuccessMessage("Account verified successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  } catch (err: any) {
    console.error("OTP verification error:", err);
    setError(err?.data?.message || err?.data?.error || "Invalid or expired OTP. Please try again.");
  }
};


  // Handle OTP input with proper form state management
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setValue("otpCode", value, { shouldValidate: true });
  };

  // Check if button should be enabled
  const isButtonDisabled = isLoading || otpValue.length !== 6;
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-blue-600 font-semibold">{email}</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm text-center">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm text-center flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              {successMessage}
            </p>
          </div>
        )}
        {resendMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
            <p className="text-sm text-center flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              {resendMessage}
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              value={otpValue}
              {...register("otpCode", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit code"
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg text-center text-xl font-mono tracking-widest focus:border-transparent transition-all ${errors.otpCode ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              onChange={handleOtpChange}
              autoComplete="off"
              autoFocus
            />
            {errors.otpCode && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.otpCode.message}</p>
            )}
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">
                {otpValue.length}/6 digits entered
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 px-4 rounded-lg cursor-pointer text-white font-semibold transition-all duration-200 ${isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 active:transform active:scale-95 shadow-lg hover:shadow-xl"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              <span>Verify & Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterOtp;
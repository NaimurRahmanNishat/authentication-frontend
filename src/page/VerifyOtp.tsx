/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useVerifyOtpMutation } from "../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/auth/authSlice";

type OtpInputs = {
  otpCode: string;
};

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit, formState: { errors }, watch } = useForm<OtpInputs>();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  
  const otpValue = watch("otpCode", "");

  useEffect(() => {
    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      try {
        const { email } = JSON.parse(pendingUser);
        setEmail(email);
      } catch (err) {
        console.error("Error parsing pending user:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = async ({ otpCode }: OtpInputs) => {
    try {
      setError("");
      setSuccessMessage("");
      const response = await verifyOtp({ email, otpCode }).unwrap();
      if (response.success && response.data) {
        const { token, id, username, email: userEmail } = response.data;
        // Update Redux store
        dispatch(setUser({ token, user: { id, username, email: userEmail }}));
        // Clear pending user data
        localStorage.removeItem("pendingUser");
        setSuccessMessage("Login successful! Redirecting...");
        // Navigate to dashboard/home after short delay
        setTimeout(() => {
          navigate("/");
        }, 100);
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(err?.data?.message || err?.data?.error || "Invalid or expired OTP. Please try again.");
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem("pendingUser");
    navigate("/login");
  };

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              {...register("otpCode", { 
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Please enter a valid 6-digit code"
                }
              })}
              className={`w-full px-4 py-3 border rounded-lg text-center text-xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.otpCode ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                e.target.value = value;
              }}
            />
            {errors.otpCode && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.otpCode.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otpValue.length !== 6}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
              isLoading || otpValue.length !== 6
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
                Verifying...
              </span>
            ) : (
              "Verify & Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <button 
              type="button"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium hover:underline transition-colors"
              onClick={() => {
                // Implement resend OTP logic here
                alert("Resend OTP functionality would be implemented here");
              }}
            >
              Resend Code
            </button>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-gray-600 hover:text-gray-500 text-sm hover:underline transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
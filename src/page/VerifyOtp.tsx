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
  const { register, handleSubmit, formState: { errors } } = useForm<OtpInputs>();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  useEffect(() => {
    const pendingUser = localStorage.getItem("pendingUser");
    if (pendingUser) {
      const { email } = JSON.parse(pendingUser);
      setEmail(email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const onSubmit = async ({ otpCode }: OtpInputs) => {
    try {
      const response = await verifyOtp({ email, otpCode }).unwrap();
      const { token, id, username, email: userEmail }: any = response.data;

      // Redux update
      dispatch(setUser({ token, user: { id, username, email: userEmail } }));
      localStorage.removeItem("pendingUser");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded mb-2"
          {...register("otpCode", { required: "OTP is required" })}
        />
        {errors.otpCode && <p className="text-red-500 mb-2">{errors.otpCode.message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
 
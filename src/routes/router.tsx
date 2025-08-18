import App from "@/App";
import ErrorPage from "@/components/shared/ErrorPage";
import ForgotPassword from "@/page/ForgotPassword";
import HomePage from "@/page/Home";
import LoginPage from "@/page/Login";
import RegisterPage from "@/page/Register";
import ResetPassword from "@/page/ResetPassword";
import VerifyOtp from "@/page/VerifyOtp";
import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
    { 
        path: "/", 
        element: <App />, 
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
                        {
                path: "/register",
                element: <RegisterPage/>
            },
            {
                path: "/login",
                element: <LoginPage/>
            },
            {
                path: "/verify-otp",
                element: <VerifyOtp/>
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "/reset-password",
                element: <ResetPassword/>
            },
        ]
    },
]);

export default router;
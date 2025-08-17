import App from "@/App";
import ErrorPage from "@/components/shared/ErrorPage";
import HomePage from "@/page/Home";
import LoginPage from "@/page/Login";
import RegisterPage from "@/page/Register";
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
                path: "/login",
                element: <LoginPage/>
            },
            {
                path: "/register",
                element: <RegisterPage/>
            }
        ]
    },
]);

export default router;
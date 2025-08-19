import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";


const Navbar = () => {
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(logout());
    }
    return (
        <div className="max-w-screen-xl mx-auto h-20 px-4 md:px-0 flex items-center justify-between border-b">
            {/* logo */}
            <Link to={"/"} className="text-2xl cursor-pointer font-bold bg-gradient-to-br from-purple-500 to-yellow-600 bg-clip-text text-transparent">Auth</Link>
            {/* logout button */}
            <button onClick={handleClick} className="bg-red-500 hover:bg-red-600 text-white px-4 text-xl py-2 cursor-pointer rounded-md">Logout</button>
        </div>
    )
}

export default Navbar;
import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";


const App = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  return (
    <div>
      {user && <Navbar/>}
      <Outlet/>
    </div>
  )
}

export default App;
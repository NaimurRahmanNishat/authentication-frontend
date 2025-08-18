import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;

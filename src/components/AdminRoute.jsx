import { Navigate, Outlet } from "react-router";
import useAuthStore from "../contexts/authStore";

const AdminRoute = () => {
  const { user } = useAuthStore();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

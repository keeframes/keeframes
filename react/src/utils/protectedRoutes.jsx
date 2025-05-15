import { Outlet, Navigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/contexts";

// code runs after the component renders and checks for authentication
const ProtectedRoutes = () => {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  // if TRUE renders Outlet for access of protected pages -> else if FALSE Navigate to login page
  return user && !loading ? <Outlet /> : <Navigate to="/login/" />;
};

export default ProtectedRoutes;

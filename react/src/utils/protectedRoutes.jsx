import { Outlet, Navigate } from "react-router-dom";
import AuthService from "../api/authService"; // handles AUTH API requests
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/contexts";


// code runs after the component renders and checks for authentication
const ProtectedRoutes = () => { 
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { setUser } = useCurrentUser();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await AuthService.is_authenticated();
        const data = await response.data;

        if (data) {
          setIsAuthenticated(true);
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
          setIsAuthenticated(false);
          setUser(null);
      }
};

checkAuth();
  }, []); // empty array means it runs ONLY ONCE after the first render

if (isAuthenticated == null) {
  return <div>Loading...</div>;
}

// if TRUE renders Outlet for access of protected pages -> else if FALSE Navigate to login page
return isAuthenticated ? <Outlet /> : <Navigate to="/login/" />;
};

export default ProtectedRoutes;

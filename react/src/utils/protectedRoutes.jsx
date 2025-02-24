import { Outlet, Navigate } from "react-router-dom";
import AuthService from "../api/authService"; // handles AUTH API requests
import { useEffect, useState } from "react";


// code runs after the component renders and checks for authentication
const ProtectedRoutes = () => { 
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      await AuthService.is_authenticated() // checks user login from the backend request
        .then(() => { // success
          setIsAuthenticated(true)
        })
        .catch(() => { // fail
          setIsAuthenticated(false);
        })
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

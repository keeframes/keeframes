import { createContext, useEffect, useState } from "react";
import authService from "../api/authService";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUser = async () => {
    try {
      const data = await authService.isAuthenticated();
      setUser(data);
    } catch (err) {
      setUser(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  return <UserContext.Provider value={{ user, setUser, getUser, loading, error }}>
    {children}
  </UserContext.Provider>
}

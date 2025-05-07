import { createContext, useState } from "react";
import authService from "../api/authService";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  return <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>
}

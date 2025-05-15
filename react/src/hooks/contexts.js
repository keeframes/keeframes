import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};

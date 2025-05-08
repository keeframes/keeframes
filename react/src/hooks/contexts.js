import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { SignUpContext } from "../contexts/SignUpContext";

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};

export function useSignUp() {
  const context = useContext(SignUpContext);
  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider");
  }
  return context;
}

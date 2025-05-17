import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { FormStoreContext } from "../contexts/FormStoreContext";

export function useCurrentUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};

export function useFormStore() {
  const context = useContext(FormStoreContext);
  if (!context) {
    throw new Error("useFormStore must be used within a FormStoreProvider");
  }
  return context;
}

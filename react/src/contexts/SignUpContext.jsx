import { createContext } from "react";

export const SignUpContext = createContext(null);

export function SignUpProvider({ children, data, setData, stepControls, error, setError }) {
  // function for changing the data in the inputs to be in the form
  const handleChange = (e) => {
    e.preventDefault();
    setError(null);

    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <SignUpContext.Provider
      value={{ handleChange, data, setData, error, stepControls }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

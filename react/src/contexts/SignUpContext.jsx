import { createContext } from "react";

export const SignUpContext = createContext(null);

export function SignUpProvider({
  children,
  data,
  setData,
  stepControls,
  error,
  setError,
}) {
  // function for changing the data in the inputs to be in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: name === "age" ? parseInt(value) : value, // Convert age to number
    });
  };

  return (
    <SignUpContext.Provider
      value={{ handleChange, data, setData, error, stepControls }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

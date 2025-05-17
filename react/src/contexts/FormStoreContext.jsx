import { createContext, useRef, useState } from "react";

export const FormStoreContext = createContext(null);

// this is to store the forms and use them across components
// the format will be like (form name: form inputs)
export const FormStoreProvider = ({ children }) => {
  // we have to use a ref so that data persists across renders
  // it also prevents unnecessary re renders
  // a map is literally the equivalent of a Python dict
  const formsRef = useRef(new Map());

  // we will need to force a re render and we can do this
  // by incrementing a state value by 1
  const [, forceUpdate] = useState(0);

  const initForm = (key, initialValues) => {
    if (!formsRef.current.has(key)) {
      // add a form to the formsRef eg. ("signup", [email: "", name: ""])
      formsRef.current.set(key, initialValues);

      // force an update by incrementing
      forceUpdate((n) => n + 1);
    }
  };

  // returns a form with a key
  const getForm = (key) => formsRef.current.get(key) || {};

  // updates a field within a form
  const updateField = (key, name, value) => {
    // gets the current values from a form
    const form = getForm(key);

    // updates the forms map to include all the form values
    // including the updated field
    formsRef.current.set(key, { ...form, [name]: value });

    // force an update by incrementing
    forceUpdate((n) => n + 1);
  };

  // resets a form's values
  const resetForm = (key, initialValues = {}) => {
    // reset a form to its initial values
    formsRef.current.set(key, initialValues);

    // force an update by incrementing
    forceUpdate((n) => n + 1);
  };

  return (
    <FormStoreContext.Provider value={{ initForm, getForm, updateField, resetForm }}>
      {children}
    </FormStoreContext.Provider>
  );
};

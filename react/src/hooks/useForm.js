import { useEffect } from "react";
import { useFormStore } from "./contexts"

export default function useForm(key, initialValues) {
  const { initForm, getForm, updateField, resetForm } = useFormStore();

  // want to initialise a form if values were passed
  useEffect(() => {
    if (initialValues) {
      initForm(key, initialValues);
    }
  }, [key, initialValues, initForm]);

  // for when the inputs change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // update field of form with new data
    updateField(key, name, type === 'checkbox' ? checked : value);
  }

  // get the values from the form
  const values = getForm(key);

  // return everything
  return {values, handleChange, reset: () => resetForm(key, initialValues)};
}

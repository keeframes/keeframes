import styles from "./PersonalForm.module.css";
import { useSignUp } from "../../hooks/contexts";
import personalSchema from "../../validation/personalValidation";
import PronounsSelect from "../PronounsSelect/PronounsSelect";

const onlyAllowNumbers = (e) => {
  if (
    [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
    ].includes(e.key)
  ) {
    return;
  }
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
};

export default function PersonalForm() {
  const { data, handleChange, error } = useSignUp();

  // shows appropriate error based on error state
  const Errors = () => {
    if (!error) return;

    return <p className="error">{error}</p>
  }

  return (
    <>
      <h1>Personal Details</h1>
      <Errors />
      <div className="form-row">
        <label htmlFor="fullname">Name</label>
        <input
          type="text"
          name="fullname"
          value={data.fullname}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div className="form-row">
        <label htmlFor="gender">Gender</label>
        <select
          name="gender"
          required
          onChange={handleChange}
          value={data.gender}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer not to say">Prefer not to say</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          value={data.age}
          min="0"
          max="130"
          inputMode="numeric"
          onKeyDown={onlyAllowNumbers}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="pronouns">Pronouns</label>
        <PronounsSelect
          required
          data={data}
          onChange={handleChange}
        />
      </div>
      <PronounsSelect.Input data={data} handleChange={handleChange}/>
    </>
  );
}

PersonalForm.validate = function validate(data) {
  try {
    console.log(data)
    personalSchema.parse(data)
  } catch (error) {
    if (error.errors) {
      throw new Error(error.errors[0].message)
    }
  }
};

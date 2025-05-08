import styles from "./PersonalForm.module.css"
import { useSignUp } from "../../hooks/contexts";

export default function PersonalForm() {
  const { data, handleChange } = useSignUp();

  return (
    <>
      <h1>Personal Details</h1>
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
        <input
          type="text"
          name="gender"
          value={data.gender}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div className="form-row">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          value={data.age}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div className="form-row">
        <label htmlFor="pronouns">Pronouns</label>
        <input
          type="text"
          name="pronouns"
          value={data.pronuns}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
    </>
  );
}

export const validatePersonalData = (data) => {
  if (data.password.length < 8) {
    throw new Error("PASS_NOT_STRONG");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("PASS_NOT_EQUAL");
  }

  async () => {
    try {
     
    } catch (error) {
    }
  };
};

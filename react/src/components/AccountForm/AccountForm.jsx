import { checkUserExists } from "../../api/user";
import styles from "./AccountForm.module.css";
import { useSignUp } from "../../hooks/contexts";
import accountSchema from "../../validation/accountValidation";

export default function AccountForm() {
  const { data, handleChange, error } = useSignUp();

  // shows appropriate error based on error state
  const Errors = () => {
    if (!error) return;

    return <p className="error">{error}</p>
  }

  return (
    <>
      <h1>Account Details</h1>
      <Errors />
      <div className="form-row">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );
}

// returns an error if any of the inputs have bad data
AccountForm.validate = async function validate(data) {
  try {
    await checkUserExists(data.username);
    await checkUserExists(null, null, data.email);
    accountSchema.parse(data);
  } catch (error) {
    // this means that this is a zod error
    if (error.errors) {
      throw new Error(error.errors[0].message)
    } else {
      throw error
    }
  }
};

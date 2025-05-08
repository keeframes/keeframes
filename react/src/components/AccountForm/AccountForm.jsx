import { useState } from "react";
import { checkUserExists } from "../../api/user";
import styles from "./AccountForm.module.css";
import { useSignUp } from "../../hooks/contexts";

export default function AccountForm() {
  const { data, handleChange, error } = useSignUp();

  // shows appropriate error based on error state
  const Errors = () => {
    if (!error) return;

    if (error === "USERNAME_EXISTS") {
      return <p className="error">This username exists</p>
    }

    if (error === "EMAIL_EXISTS") {
      return <p className="error">This email exists</p>
    }

    if (error === "PASS_NOT_STRONG") {
      return <p className="error">The password must be at least 8 characters</p>
    }

    if (error === "PASS_NOT_EQUAL") {
      return <p className="error">Passwords do not match up</p>
    }

    if (error === "INTERNAL_SERVER") {
      return <p className="error">Internal server error</p>
    }
  };

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
  } catch (error) {
    throw error
  }

  // validates if password is > 8 characters
  if (data.password.length < 8) {
    throw new Error("PASS_NOT_STRONG");
  }

  // validates if password is equal to confirm password
  if (data.password !== data.confirmPassword) {
    throw new Error("PASS_NOT_EQUAL");
  }
};

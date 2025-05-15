import styles from "./SignUpForm.module.css";
import formStyles from "../../styles/Form.module.css";
import buttonStyles from "../../styles/Button.module.css";
import { useState } from "react";
import KInput from "../KInput/KInput";
import KButton from "../KButton/KButton";
import ArrowCycle from "../../assets/arrow-cycle.svg?react";
import authService from "../../api/authService";

export default function SignUpForm() {
  const [data, setData] = useState({
    email: "",
    username: "",
    nickname: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      authService.signup(data.email, data.password, data.nickname, data.username);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <KInput
          name="email"
          value={data.email}
          type="email"
          onChange={handleChange}
          label="Email Address"
          placeholder="Your Email Address"
          span={true}
        />
        <KInput
          name="username"
          value={data.username}
          type="text"
          onChange={handleChange}
          label="Username"
          placeholder="Your Username"
          helperText="Must be unique."
        />
        <KInput
          name="nickname"
          value={data.nickname}
          type="text"
          onChange={handleChange}
          label="Nickname"
          placeholder="Your Nickname"
          helperText="Display name."
        />
        <KInput
          name="password"
          value={data.password}
          type="password"
          onChange={handleChange}
          label="Password"
          placeholder="Your Password"
          helperText="Passwords must at least have 8 characters."
        />
        <KInput
          name="confirm"
          value={data.confirm}
          type="password"
          onChange={handleChange}
          label="Confirm Password"
          placeholder="Re-type Password"
          helperText="Must be the same as password."
        />
        
        <KButton variant="accent" span={true} type="submit">Next</KButton>
      </form>
    </>
  );
}

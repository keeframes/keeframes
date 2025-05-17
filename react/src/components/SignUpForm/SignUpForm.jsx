import styles from "./SignUpForm.module.css";
import KButton from "../KButton/KButton";
import authService from "../../api/authService";
import useForm from "../../hooks/useForm";
import KForm from "../KForm/KForm";
import Google from "../../assets/google.svg?react"
import { Link, useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const navigate = useNavigate();

  // creating the form
  const { values } = useForm("signup", {
    email: "",
    username: "",
    nickname: "",
    password: "",
    confirm: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      authService.signup(
        values.email,
        values.password,
        values.nickname,
        values.username,
      );

      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSubmit = async (e) => {
    try {
      authService.googleAuth()
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <KForm
        name="signup"
        header="Welcome to Keeframes"
        columns={2}
        description={
          <>
            <KButton
              TailIcon={Google}
              size="medium"
              onClick={handleGoogleSubmit}
            >
              Continue with Google
            </KButton>
            <p className={styles.or}>or</p>
          </>
        }
        footer={
          <p className={styles.login}>Have an account? <Link to="/login">Log in.</Link></p>
        }
        onSubmit={handleSubmit}
        fields={[
          {
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Your Email Address",
            span: true,
          },
          {
            name: "username",
            type: "text",
            label: "Username",
            placeholder: "Your Username",
            helperText: "Must be unique.",
          },
          {
            name: "nickname",
            type: "text",
            label: "Nickname",
            placeholder: "Your Nickname",
            helperText: "Display Name.",
          },
          {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Your Password",
            helperText: "Password must at least have 8 characters",
          },
          {
            name: "confirm",
            type: "password",
            label: "Confirm",
            placeholder: "Re-type Password",
            helperText: "Must be the same as password.",
          },
        ]}
      >
        <KButton variant="accent" span={2} type="submit">
          Next
        </KButton>
      </KForm>
    </>
  );
}

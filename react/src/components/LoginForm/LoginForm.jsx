import styles from "./LoginForm.module.css"
import KButton from "../KButton/KButton";
import authService from "../../api/authService";
import useForm from "../../hooks/useForm";
import KForm from "../KForm/KForm";
import Google from "../../assets/google.svg?react"
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  // creating the form
  const { values } = useForm("login", {
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      response = await authService.login(
        values.email,
        values.password,
      );

    } catch (err) {
      if (err.error === "CONFIRM_ACCOUNT") {
        navigate(`/signup/confirm?email=${values.email}`)
      }
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
        name="login"
        header="Login to Keeframes"
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
          <>
            <Link to="/reset">Reset Password</Link>
            <p>No account? <Link to="/signup">Create one.</Link></p>
          </>
        }
        onSubmit={handleSubmit}
        fields={[
          {
            name: "email",
            type: "email",
            label: "Email Address",
            placeholder: "Your Email Address",
          },
                  {
            name: "password",
            type: "password",
            label: "Password",
            placeholder: "Your Password",
          }
        ]}
      >
        <KButton variant="accent" type="submit">
          Submit
        </KButton>
      </KForm>
    </>
  );
}

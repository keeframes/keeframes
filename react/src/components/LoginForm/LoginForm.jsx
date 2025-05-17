import styles from "./LoginForm.module.css"
import KButton from "../KButton/KButton";
import authService from "../../api/authService";
import useForm from "../../hooks/useForm";
import KForm from "../KForm/KForm";
import Google from "../../assets/google.svg?react"
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  // creating the form
  const { values } = useForm("login", {
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      authService.login(
        values.email,
        values.password,
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
        <KButton variant="accent" span={true} type="submit">
          Submit
        </KButton>
      </KForm>
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css"
import LoginForm from "../../components/LoginForm/LoginForm";
import { useEffect } from "react";
import { API_URL } from "../../utils/constants";

function Login() {
  const navigate = useNavigate();

   useEffect(() => {
    // when a user authenticates with google it sends an event message
    // this is so i can access the id token through multiple windows
    const handleGoogleMessage = async (e) => {
      // check if event came from window
      if (e.origin != API_URL) return;

      const idToken = e.data.data.idToken
      const type = e.data.type

      // log in the user and log them in
      if (type === "OAUTH_SUCCESS" && idToken) {
        localStorage.setItem("idToken", idToken);

        navigate("/");
      }
    };
    window.addEventListener("message", handleGoogleMessage);
    return () =>
      window.removeEventListener("message", handleGoogleMessage);
  }, []);

  return (
  <>
      <LoginForm/>
    </>
  )
}

export default Login;

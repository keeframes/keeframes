import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css"
import LoginForm from "../../components/LoginForm/LoginForm";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // when a user authenticates with google it sends an event message
    // this is so i can access the id token through multiple windows
    const handleGoogleMessage = async (e) => {
      // check if event came from window
      if (e.origin != window.location.origin) return;

      // get data from event
      const { type, idToken } = e.data;

      // log them in
      if (type === "oauth-success" && idToken) {
        // by setting the idToken in local storage the user
        // is automatically logged in
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

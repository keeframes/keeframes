import { useEffect, useState } from "react";
import authService from "../../api/authService";
import styles from "./SignUpPage.module.css";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import KButton from "../../components/KButton/KButton";
import Google from "../../assets/google.svg?react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../utils/httpClient";
import { API_URL } from "../../utils/constants";

export default function SignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    // when a user authenticates with google it sends an event message
    // this is so i can access the id token through multiple windows
    const handleGoogleMessage = async (e) => {
      // check if event came from window
      if (e.origin != API_URL) return;

      const idToken = e.data.data.idToken
      const type = e.data.type

      // sign up the user and log them in
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
      <SignUpForm />
    </>
  );
}

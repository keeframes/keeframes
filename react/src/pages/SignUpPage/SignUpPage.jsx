import { useState } from "react";
import authService from "../../api/authService";
import styles from "./SignUpPage.module.css";
import SignUpForm from "../../components/SignUpForm/SignUpForm";
import KButton from "../../components/KButton/KButton";
import Google from "../../assets/google.svg?react"

export default function SignUp() {
  return (
  <>
      <div className={styles.container}>
        <h2>Welcome to Keeframes</h2>
        <div className={styles.oauth}>
          <KButton TailIcon={Google} size="medium" onClick={() => authService.signUpGoogle()}>Continue with Google</KButton>
        </div>
        <p className={styles.or}>or</p>
        <SignUpForm/>
      </div>
    </>
  )
}

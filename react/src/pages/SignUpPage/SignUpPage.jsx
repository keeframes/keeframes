import SignUpMultiForm from "../../components/SignUpMultiForm/SignUpMultiForm";
import styles from "./SignUpPage.module.css";

export default function SignUp() {
  return (
    <div className={styles.container}>
      <SignUpMultiForm />
    </div>
  );
}
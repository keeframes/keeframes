import { useState } from "react";
import authService from "../../api/authService";
import styles from "./SignUpPage.module.css";

export default function SignUp() {
  const [data, setData] = useState({
    nickname: "",
    email: "",
    password: "",
    username: ""
  })

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    authService.login(data.email, data.password);
    //authService.signup(data.email, data.password, data.nickname, data.username)
  }

  return (
    <>
      <button onClick={() => authService.resendConfirmationCode("cbonner.dev@outlook.com")}>CLICK ME</button>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nickname" value={data.nickname} onChange={handleChange}/>
          <input type="text" name="username" value={data.username} onChange={handleChange}/>
          <input type="email" name="email" value={data.email} onChange={handleChange}/>
          <input type="password" name="password" value={data.password} onChange={handleChange}/>
          <button>SIGN UP</button>
        </form>
        <button onClick={() => authService.signUpGoogle()}>Continue with google</button>
      </div>
    </>
  );
}

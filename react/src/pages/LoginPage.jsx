import { useState } from "react";
import styles from "../styles/LoginPage.module.css"
import { Link, useNavigate } from "react-router-dom";
import authService from "../api/authService"

function Login() {
  // allows for page redirection
  const navigate = useNavigate()
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    // sets the corresponding value in object based on input
    setValues({...values, [e.target.name]: e.target.value})
  }

  const handleSubmit = (e) => {
    // prevents form from refreshing the page
    e.preventDefault()
    try {
      authService.login(values.email, values.password)
        .then(() => {
          navigate("/")
        })
    } catch (error) {
      console.log(error)
    }
  }

  return <>
    <div className={styles.container}>
      <form>
        <h1>Log in</h1>
        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input onChange={handleChange} name="email" type="email"/>
        </div>
        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input onChange={handleChange} name="password" type="password"/>
        </div>
        <hr/>
        <div className={styles.actions}>
          <button onClick={handleSubmit} className={styles.create}>Log in</button>
          <p>Don't have an account? <Link to="/signup" className={styles.clickable}>Create One</Link></p>
          <Link to="/forgot" className={styles.clickable}>Forgot Password</Link>
        </div>
      </form>
    </div>
  </>;
}

export default Login;

import { useState } from "react";
import styles from "../styles/SignUpPage.module.css";
import authService from "../api/authService";
import {Link, useNavigate} from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [values, setValues] = useState({
        name: "name",
        username: "username",
        email: "email",
        password: "password"
    }); 

    const handleChange = (e) => {
        setError(null)
        setValues({...values, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const form = e.target;
        const isValid = form.checkValidity();

        if (!isValid) {
            setError("Submission is invalid")
        }
        else {
            authService.signup(values.name, values.username, values.email, values.password)
            .then(() => {
                authService.login(values.email, values.password)
                .then(() => {
                    navigate("/")
                })
                .catch(() => {
                    if (error.status === 401) {
                        setError("invalid-credentials");
                    } else if (error.status === 500) {
                        setError("server-error");
                    } else if (error.status === 404) {
                        setError("connection-error");
                    }  
                })
            })
            .catch((error) => {
                if (error.status === 401) {
                    setError("invalid-credentials");
                  } else if (error.status === 500) {
                    setError("server-error");
                  } else if (error.status === 404) {
                    setError("connection-error");
                  }                
            })
        }
    }

    // I WILL CHANGE THIS TO FIT FOR SIGNUP 
    return <>
        <div className={styles.container}>
        <form onSubmit={handleSubmit}>
            <h1>Sign Up</h1>
            <p className={`${styles.invalid} ${error != "invalid-credentials" ? "hide": ""}`}>The email or password is incorrect</p>
            <p className={`${styles.invalid} ${error != "server-error" ? "hide": ""}`}>There is an issue with our servers</p>
            <p className={`${styles.invalid} ${error != "connection-error" ? "hide": ""}`}>Unable to connect to servers</p>
            <div className={styles.names}>
                <div className={styles.row}>
                    <label htmlFor="name">Name</label>
                    <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="name" type="name"/>
                </div>

                <div className={styles.row}>
                    <label htmlFor="username">Username</label>
                    <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="username" type="username"/>
                </div>
            </div>
            <div className={styles.row}>
                <label htmlFor="email">Email</label>
                <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="email" type="email"/>
            </div>
            <div className={styles.row}>
                <label htmlFor="password">Password</label>
                <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="password" type="password"/>
            </div>
            <hr/>
            <div className={styles.actions}>
                <button className={styles.create}>Sign Up</button>
                <p className={`${styles.invalid} ${error != "invalid-form" ? "hide": ""}`}>Please provide a valid email and password</p>
                <p>Already have an account? <Link to="/login" className={styles.clickable}>Login Here</Link></p>
            </div>
        </form>
        </div>
    </>;

}

export default SignUp;
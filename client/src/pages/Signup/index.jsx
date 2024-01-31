import { Link } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const registerBtn = () => {
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          toast.success("Registration Successful", {
            onClose: () => {
              window.location.href = "/login";
            },
          });
        }
        if (res.status === 400) {
          setTimeout(() => {
            toast.error("Registration Failed");
          }, 2000);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.msg);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const googleAuth = () => {
    setLoading(true);

    window.open(
      `${process.env.REACT_APP_API_URL}/auth/google/callback`,
      "_self"
    );

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Sign up Form</h1>
      <div className={styles.form_container}>
        <div className={styles.left}>
          <img className={styles.img} src="./images/signup.jpg" alt="signup" />
        </div>
        <div className={styles.right}>
          <h2 className={styles.from_heading}>Create Account</h2>
          <input
            type="text"
            className={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className={styles.input}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={styles.btn} onClick={registerBtn}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className={styles.text}>or</p>
          <button className={styles.google_btn} onClick={googleAuth}>
            {loading ? (
              "Signing Up..."
            ) : (
              <>
                <img src="./images/google.png" alt="google icon" />
                <span>Sing up with Google</span>
              </>
            )}
          </button>
          <p className={styles.text}>
            Already Have Account ? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;

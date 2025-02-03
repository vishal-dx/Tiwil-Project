import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/Auth.module.css";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle login submission
  const handleLogin = async () => {
    setMessage("Logging in...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, formData);
        console.log(response,'555555555555555555555555555555')
      if (response.data.success) {
        setMessage("Login Successful!");
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("storage")); // ✅ Force Navbar update
        navigate("/home"); // ✅ Redirect to Home
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(error.response?.data?.message || "Error logging in.");
    }
  };
  

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.welcomeText}>Sign In</h1>

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input}
      />

      <button className={styles.button} onClick={handleLogin}>
        Login
      </button>

      <p className={styles.message}>{message}</p>

      <p className={styles.toggleText}>
        New to Tiwil? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;

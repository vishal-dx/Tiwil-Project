import React, { useState } from "react";
import styles from "../../styles/Auth.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "", // Added password field
    otp: "",
  });

  const [message, setMessage] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(false);
  const navigate = useNavigate()
  
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    setMessage("Sending OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/send-otp`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password, // Now including password
      });

      if (response.data.success) {
        setConfirmationResult(true);
        setMessage("OTP Sent Successfully! Check your email.");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error sending OTP.");
    }
  };

  const handleVerifyOTP = async () => {
    setMessage("Verifying OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/verify-otp`, formData);
        console.log(response,'5555555555555555555555555')
      if (response.data.success) {
        setMessage("Signup Successful!");
        setFormData({
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "", // Added password field
            otp: "",
          })
          localStorage.setItem("fullname", response.data.user.fullName)
          navigate('/signin')
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error verifying OTP.");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.welcomeText}>Sign Up</h1>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
      />

      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
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

      {confirmationResult && (
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          className={styles.input}
        />
      )}

      {!confirmationResult ? (
        <button className={styles.button} onClick={handleSendOTP}>
          Send OTP
        </button>
      ) : (
        <button className={styles.button} onClick={handleVerifyOTP}>
          Verify OTP
        </button>
      )}

      <p className={styles.message}>{message}</p>

      <p className={styles.toggleText}>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}

export default Signup;

import React, { useState } from "react";
import styles from "../../styles/Auth.module.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
  });

  const [otpGenerated, setOtpGenerated] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Send OTP
  const handleSendOTP = async () => {
    setMessage("Sending OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login/send-otp`, {
        phoneNumber: formData.phoneNumber,
      });

      if (response.data.success) {
        setOtpGenerated(response.data.otp); // Show OTP for demo
        setIsOtpSent(true);
        setMessage("OTP Sent Successfully!");
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage(error.response?.data?.message || "Error sending OTP.");
    }
  };

  // // Handle Verify OTP
  // const handleVerifyOTP = async () => {
  //   setMessage("Verifying OTP...");
  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login/verify-otp`, {
  //       phoneNumber: formData.phoneNumber,
  //       otp: formData.otp,
  //     });

  //     if (response.data.success) {
  //       setMessage("Login Successful!");

  //       // Store user details in localStorage
  //       localStorage.setItem("fullName", response.data.user.fullName);
  //       localStorage.setItem("email", response.data.user.email);
  //       localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
  //       localStorage.setItem("token", response.data.token);

  //       navigate("/home"); // Redirect to home page
  //     } else {
  //       setMessage(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error verifying OTP:", error);
  //     setMessage(error.response?.data?.message || "Error verifying OTP.");
  //   }
  // };

  const handleVerifyOTP = async () => {
    setMessage("Verifying OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login/verify-otp`, {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
      });
  
      if (response.data.success) {
        setMessage("Login Successful!");
  
        // Check if `user` object exists in the response
        const user = response.data.user || {};
        localStorage.setItem("fullName", user.fullName || "");
        localStorage.setItem("email", user.email || "");
        localStorage.setItem("phoneNumber", user.phoneNumber || "");
        localStorage.setItem("token", response.data.token);
  
        navigate("/home"); // Redirect to home page
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage(error.response?.data?.message || "Error verifying OTP.");
    }
  };
  

  return (
    <div className={styles.authContainer}>
      <img src={`${process.env.PUBLIC_URL}/assets/TiwilLOGO 1.png`} alt="Tiwil Logo" className={styles.logo} />
      <h1 className={styles.welcomeText}>Welcome</h1>
      <p className={styles.subText}>Connect with your friends today!</p>
      <div className={styles.tabContainer}>
        <button
          className={styles.tabButton}
          onClick={() => navigate("/signup")} // Navigate to Sign Up
        >
          Sign Up
        </button>
        <button
          className={`${styles.tabButton} ${styles.activeTab}`} // Active state
        >
          Sign In
        </button>
      </div>


      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className={styles.input}
      />

      {isOtpSent && (
        <>
          <p className={styles.otpPopup}>Your OTP is: <strong>{otpGenerated}</strong></p>
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            className={styles.input}
          />
        </>
      )}

      {!isOtpSent ? (
        <button className={styles.button} onClick={handleSendOTP}>
          Send OTP
        </button>
      ) : (
        <button className={styles.button} onClick={handleVerifyOTP}>
          Verify OTP
        </button>
      )}

<p>New on Tiwil <Link to="/signup">Signup</Link></p>

      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default SignIn;

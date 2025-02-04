import React, { useState } from "react";
import styles from "../../styles/Auth.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    otp: "",
  });

  const [otpGenerated, setOtpGenerated] = useState(""); // Store generated OTP for display
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // To show OTP field
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Send OTP
  const handleSendOTP = async () => {
    setMessage("Sending OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/send-otp`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      if (response.data.success) {
        setOtpGenerated(response.data.otp); // Display OTP for demo
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

  // Handle Verify OTP
  const handleVerifyOTP = async () => {
    setMessage("Verifying OTP...");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup/verify-otp`, {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
      });

      if (response.data.success) {
        setMessage("Signup Successful!");

        // Store user details in localStorage
        localStorage.setItem("fullName", response.data.user.fullName);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("phoneNumber", response.data.user.phoneNumber);
        localStorage.setItem("token", response.data.token);

        navigate("/profile"); // Redirect to profile setup
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
    className={`${styles.tabButton} ${styles.activeTab}`} // Active state
    onClick={() => navigate("/signup")}
  >
    Sign Up
  </button>
  <button
    className={styles.tabButton}
    onClick={() => navigate("/signin")} // Navigate to Sign In
  >
    Sign In
  </button>
</div>


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
      <p>By creating an account, I accept the Terms & Conditions & Privacy Policy</p>

      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default Signup;

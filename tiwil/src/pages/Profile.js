import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddInfomation.module.css"; // Reusing AddInformation styles
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    phoneNumber: localStorage.getItem("phoneNumber") || "",
    gender: "",
    dob: "",
    location: "",
    maritalStatus: "",
    profileImage: "",
  });

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileImage(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!userData.fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    if (!userData.dob) {
      alert("Please enter your Date of Birth.");
      return;
    }

    if (!userData.location.trim()) {
      alert("Please enter your Location.");
      return;
    }

    if (!userData.gender) {
      alert("Please select your gender.");
      return;
    }

    if (!userData.maritalStatus) {
      alert("Please select your Marital Status.");
      return;
    }

    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    if (selectedProfileImage) {
      formData.append("profileImage", selectedProfileImage);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Profile saved successfully!");
        navigate("/add-information");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Profile Setup</h2>

      <div className={styles.profileImageContainer}>
        Profile Picture
        <img
          src={`${process.env.REACT_APP_BASE_URL}${userData.profileImage}`}
          alt=""
          className={styles.profileImage}
        />
        <input type="file" accept="image/*" onChange={handleProfileImageChange} />
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            value={userData.fullName}
            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={userData.email} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input type="tel" value={userData.phoneNumber} disabled />
        </div>

        <div className={styles.formGroup}>
          <label>Gender</label>
          <select
            value={userData.gender}
            onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            value={userData.dob}
            onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={userData.location}
            onChange={(e) => setUserData({ ...userData, location: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Marital Status</label>
          <select
            value={userData.maritalStatus}
            onChange={(e) => setUserData({ ...userData, maritalStatus: e.target.value })}
          >
            <option value="">Select</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
          </select>
        </div>
      </div>
    <div className={styles.saveBtnBox}>
      <button className={styles.saveButton} onClick={handleSave}>
        Save & Proceed
      </button>
      </div>
    </div>
  );
}

export default Profile;

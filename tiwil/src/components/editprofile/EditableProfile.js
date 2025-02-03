import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./EditableProfile.module.css";

const EditableProfile = ({ onBack }) => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    location: "",
    maritalStatus: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Handle Input Change
  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Save Updated Profile
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/profile`,
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        alert("Profile updated successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
     
      <h2 className={styles.header}>Edit Profile</h2>
      <div className={styles.profileImage}>
        <img
          src={profileData.profileImage || `${process.env.PUBLIC_URL}/assets/profile-placeholder.png`}
          alt="Profile"
        />
        <label className={styles.uploadLabel}>
          <input type="file" style={{ display: "none" }} />
          <span>Change Profile Picture</span>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label>Full Name</label>
        <input
          type="text"
          value={profileData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input type="email" value={profileData.email} disabled />
      </div>
      <div className={styles.formGroup}>
        <label>Phone Number</label>
        <input
          type="tel"
          value={profileData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Gender</label>
        <select
          value={profileData.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
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
          value={profileData.dob}
          onChange={(e) => handleChange("dob", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Location</label>
        <input
          type="text"
          value={profileData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Marital Status</label>
        <select
          value={profileData.maritalStatus}
          onChange={(e) => handleChange("maritalStatus", e.target.value)}
        >
          <option value="">Select</option>
          <option value="Married">Married</option>
          <option value="Unmarried">Unmarried</option>
        </select>
      </div>
      <button className={styles.saveButton} onClick={handleSave}>
        Save
      </button>
      <button className={styles.backButton} onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default EditableProfile;

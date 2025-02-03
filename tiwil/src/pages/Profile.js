import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Profile.module.css";
import AddInformation from "./AddInfomation";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "", 
    location: "", 
    maritalStatus: "",
    profileImage: "",
    spouse: { name: "", dob: "", image: null },
    father: { name: "", dob: "", image: null },
    mother: { name: "", dob: "", image: null },
    parentAnniversary: { date: "", image: null },
    marriageAnniversary: { date: "", image: null },
    children: [],
    siblings: [],
  });

  const [selectedProfileImage, setSelectedProfileImage] = useState(null); // State for selected profile image

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/signin");
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle the marital status change
  const handleMaritalStatusChange = (status) => {
    setUserData((prev) => ({
      ...prev,
      maritalStatus: status,
      spouse: status === "Married" ? { name: "", dob: "", image: null } : null,
      marriageAnniversary: status === "Married" ? { date: "", image: null } : null,
      hasChildren: false,
      numberOfChildren: 0,
      children: [],
    }));
  };

  // Handle file input for profile image
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedProfileImage(file); // Store the file in state
    }
  };

  const handleProfileImageUpload = async () => {
    const formData = new FormData();
    formData.append("profileImage", selectedProfileImage); // Append the selected image to FormData

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/upload-profile-image`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      console.log(response)

      if (response.data.success) {
        setUserData({ ...userData, profileImage: response.data.profileImageUrl });
        alert("Profile picture updated successfully!");
      } else {
        alert(response.data.message || "Failed to update profile image.");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to update profile image.");
    }
  };

  // Handle profile save action
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

    if (userData.maritalStatus === "Married" && !userData.spouse.name.trim()) {
      alert("Please enter your spouse's name.");
      return;
    }

    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (Array.isArray(userData[key])) {
        formData.append(key, JSON.stringify(userData[key]));
      } else if (typeof userData[key] === "object" && userData[key] !== null) {
        formData.append(key, JSON.stringify(userData[key]));
      } else {
        formData.append(key, userData[key]);
      }
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setUserData(response.data.data);
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
      <h1>Profile Setup</h1>

      <div className={styles.profileImageContainer}>
        <img
          src={userData.profileImage || "/default-profile.png"} // Use default if no profile image
          alt="Profile"
          className={styles.profileImage}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <button onClick={handleProfileImageUpload} className={styles.uploadButton}>
            Upload Profile Picture
          </button>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name</label>
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
          <select value={userData.gender} onChange={(e) => setUserData({ ...userData, gender: e.target.value })}>
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
          <select value={userData.maritalStatus} onChange={(e) => handleMaritalStatusChange(e.target.value)}>
            <option value="">Select</option>
            <option value="Unmarried">Unmarried</option>
            <option value="Married">Married</option>
          </select>
        </div>

        {userData.maritalStatus === "Married" && (
          <div className={styles.formGroup}>
            <label>Spouse Name</label>
            <input type="text" value={userData.spouse.name} onChange={(e) => setUserData({ ...userData, spouse: { ...userData.spouse, name: e.target.value } })} />
          </div>
        )}
      </div>

      <AddInformation formData={userData} setFormData={setUserData} />

      <button className={styles.saveButton} onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default Profile;

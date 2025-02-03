import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { FiBell, FiLogOut } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { IoMdCloseCircleOutline } from "react-icons/io";
import styles from "../styles/Account.module.css";
import EditableProfile from "../components/editprofile/EditableProfile";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Account = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const navigate = useNavigate()
    const handleEditProfile = () => {
        setIsEditing(true); // Set editing mode to true
    };

    const handleCloseAccount = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("fullname");
        setIsConfirming(true); // Show the confirmation component
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("fullname");
        navigate("/signin");
        window.dispatchEvent(new Event("storage"));
    };

    const deleteAccount = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                alert("Account deleted successfully");
                // Redirect to home or login
            } else {
                alert("Failed to delete account");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
        }
    };


    const handleYes = () => {
        deleteAccount(); // Call the API
        setIsConfirming(false); // Close the confirmation screen
    };

    const handleNo = () => {
        setIsConfirming(false); // Return to the previous screen
    };

    return (
        <div>
            <Navbar />
            {isEditing ? (
                <EditableProfile onBack={() => setIsEditing(false)} />
            ) : isConfirming ? (
                <div className={styles.confirmContainer}>
                    <h3>Are you sure you want to close your account?</h3>
                    <div className={styles.confirmButtons}>
                        <button className={styles.yesButton} onClick={handleYes}>
                            Yes
                        </button>
                        <button className={styles.noButton} onClick={handleNo}>
                            No
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.container}>
                    {/* Profile Section */}
                    <div className={styles.profileSection}>
                        <img
                            src={`${process.env.PUBLIC_URL}/assets/profile-placeholder.png`}
                            alt="Profile"
                            className={styles.profileImage}
                        />
                        <h2 className={styles.profileName}>Vinod Kumar</h2>
                        <button className={styles.editButton} onClick={handleEditProfile}>
                            Edit Profile
                        </button>
                    </div>

                    {/* Options Section */}
                    <div className={styles.menuSection}>
                        <div className={styles.menuItem}>
                            <MdAccountCircle className={styles.menuIcon} />
                            <span className={styles.menuText}>Family Information</span>
                        </div>
                        <div className={styles.menuItem}>
                            <IoMdLock className={styles.menuIcon} />
                            <span className={styles.menuText}>Data and Privacy</span>
                        </div>
                        <div className={styles.menuItem}>
                            <FiBell className={styles.menuIcon} />
                            <span className={styles.menuText}>Push Notification</span>
                            <label className={styles.toggleSwitch}>
                                <input type="checkbox" className={styles.switchInput} />
                                <span className={styles.switchSlider}></span>
                            </label>
                        </div>
                        <div className={styles.menuItem} onClick={handleLogout}>
                            <FiLogOut className={styles.menuIcon} />
                            <span className={styles.menuText}>Logout</span>
                        </div>
                        <div className={styles.menuItem} onClick={handleCloseAccount}>
                            <IoMdCloseCircleOutline className={styles.menuIcon} />
                            <span className={styles.menuText}>Close Account</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;

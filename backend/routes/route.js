const express = require("express");
const { sendOTP, verifyOTP, loginUser } = require("../controllers/authController");
const { getUserData, uploadImage, updateProfile, closeAccount } = require("../controllers/userController");
const { verifyToken } = require("../middleware/validate");
const { getProfile, saveProfile, saveFamilyInfo, saveProfileAndFamilyInfo, uploadProfileImage } = require("../controllers/profileController");
const { upload, profileUpload } = require("../middleware/multer");

const router = express.Router();

router.post("/signup/send-otp", sendOTP); // Send OTP for signup
router.post("/signup/verify-otp", verifyOTP); // Verify OTP and create account
router.post("/login", loginUser); // New API for login (without OTP)
router.get("/user-data", verifyToken, getUserData);


// Route to save or update profile data
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

// Route for uploading images
router.post("/upload-image", verifyToken, upload.single("image"), uploadImage);
router.post("/profile", verifyToken, upload.single("profileImage"), saveProfileAndFamilyInfo);
router.post("/upload-profile-image", profileUpload.single("profileImage"), uploadProfileImage);
router.delete("/profile", verifyToken, closeAccount)

module.exports = router;

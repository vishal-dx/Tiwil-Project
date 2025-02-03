const express = require("express");
// const { sendOTP, verifyOTP, loginUser } = require("../controllers/authController");
const { sendOTP, verifyOTP, loginUser } = require("../controller/authController");
const { getUserData, updateProfile, uploadImage, closeAccount } = require("../controller/userController");
const { getProfile, saveProfileAndFamilyInfo, uploadProfileImage, getUserProfile, saveUserProfile } = require("../controller/profileController");
const { verifyToken } = require("../middleware/validate");
const { upload, profileUpload } = require("../middleware/multer")
const router = express.Router();

router.post("/signup/send-otp", sendOTP); // Send OTP for signup
router.post("/signup/verify-otp", verifyOTP); // Verify OTP and create account
router.post("/login", loginUser); // New API for login (without OTP)
router.get("/user-data", verifyToken, getUserData);


// Route to save or update profile data
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

router.get("/user-profile", verifyToken, getUserProfile);
router.post("/user-profile", verifyToken,profileUpload.single("profileImage"), saveUserProfile);

// Route for uploading images
router.post("/upload-image", verifyToken, upload.single("image"), uploadImage);
router.post("/profile", verifyToken, upload.single("profileImage"), saveProfileAndFamilyInfo);
router.post("/upload-profile-image", profileUpload.single("profileImage"), uploadProfileImage);
router.delete("/profile", verifyToken, closeAccount)

module.exports = router;

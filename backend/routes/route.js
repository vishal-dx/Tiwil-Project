const express = require("express");
// const { sendOTP, verifyOTP, loginUser } = require("../controllers/authController");
const { getUserData, updateProfile, uploadImage, closeAccount } = require("../controller/userController");
const { getProfile, saveProfileAndFamilyInfo, uploadProfileImage, getUserProfile, saveUserProfile } = require("../controller/profileController");
const { verifyToken } = require("../middleware/validate");
const { upload, profileUpload } = require("../middleware/multer");
const { getFamilyInfo, saveFamilyInfo, familyUpload, updateFamilyInfo } = require("../controller/familyInfoController");
const { getEvents } = require("../controller/eventsController");
const {  sendLoginOTP, sendSignupOTP, verifySignupOTP, loginWithPhone } = require("../controller/authController");
const router = express.Router();


router.post("/signup/send-otp", sendSignupOTP); // Send OTP for signup
router.post("/signup/verify-otp", verifySignupOTP); // Verify OTP and create account
router.post("/login/send-otp", sendLoginOTP); // Send OTP for login
router.post("/login/verify-otp", loginWithPhone); 

router.get("/user-data", verifyToken, getUserData);


// Route to save or update profile data
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

router.get("/user-profile", verifyToken, getUserProfile);
router.post("/user-profile", verifyToken,profileUpload.single("profileImage"), saveUserProfile);

router.get("/family-info", verifyToken, getFamilyInfo); // Get family info
router.post(
    "/family-info",
    verifyToken,
    familyUpload, // Use updated multer configuration
    saveFamilyInfo
);

router.put(
    "/family-info/update",
    verifyToken,
    upload.single("image"), // Multer for image upload
    updateFamilyInfo
  );


router.get("/events", verifyToken, getEvents);

// Route for uploading images
router.post("/profile", verifyToken, upload.single("profileImage"), saveProfileAndFamilyInfo);
router.delete("/profile", verifyToken, closeAccount)

module.exports = router;

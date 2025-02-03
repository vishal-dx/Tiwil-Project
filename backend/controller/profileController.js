const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const { v4: uuidv4 } = require("uuid"); // ✅ Import UUID generator
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
// ✅ GET Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId,'11111111111111111111')
        const profile = await User.findOne({ _id:userId });

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found." });
        }

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch profile." });
    }
};

// ✅ SAVE or UPDATE Profile & Family Info
const saveProfileAndFamilyInfo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        let {
            fullName, email, phoneNumber, gender, dob, location, maritalStatus, profileImage,
            spouse, marriageAnniversary, father, mother, parentAnniversary, siblings, hasChildren, children
        } = req.body;

        // 🔹 Function to safely parse JSON if needed
        const parseJSON = (data) => {
            try { return typeof data === "string" ? JSON.parse(data) : data; } 
            catch (error) { return null; } // Return null for invalid JSON
        };

        // ✅ Ensure all objects are properly formatted before saving
        father = parseJSON(father) || {};
        mother = parseJSON(mother) || {};
        spouse = parseJSON(spouse) || {};
        marriageAnniversary = parseJSON(marriageAnniversary) || {};
        parentAnniversary = parseJSON(parentAnniversary) || {};
        siblings = parseJSON(siblings) || [];
        children = parseJSON(children) || [];

        let profile = await Profile.findOne({ userId });

        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { userId },
                { 
                    fullName, email, phoneNumber, gender, dob, location, maritalStatus, profileImage,
                    spouse, marriageAnniversary, father, mother, parentAnniversary, hasChildren, siblings, children
                },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ success: true, message: "Profile updated successfully.", data: profile });
        }

        const newProfile = new Profile({
            userId, fullName, email, phoneNumber, gender, dob, location, maritalStatus, profileImage,
            spouse, marriageAnniversary, father, mother, parentAnniversary, hasChildren, siblings, children
        });

        await newProfile.save();

        res.status(201).json({ success: true, message: "Profile and family information saved successfully.", data: newProfile });

    } catch (error) {
        console.error("Error saving profile and family info:", error);
        res.status(500).json({ success: false, message: "Failed to save profile and family information." });
    }
};

  
  
const uploadProfileImage = (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
  
    // Get the uploaded file URL
    const profileImageUrl = `/profileImages/${req.file.filename}`;
  
    // Optionally, update the user profile with the new profile image URL in the database
    // e.g., update the user's profile image field in your User/Profile model
  
    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      profileImageUrl, // Send back the profile image URL
    });
  };
  const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        let userProfile = await UserProfile.findOne({ userId });

        if (!userProfile) {
            // Auto-create only with known details
            userProfile = new UserProfile({
                userId,
                fullName: req.user.fullName || "",
                email: req.user.email || "",
                phoneNumber: req.user.phoneNumber || "",
                gender: "", // Kept empty for frontend input
                dob: null, // Kept null to avoid validation issues
                location: "",
                maritalStatus: "",
                profileImage: "",
            });

            await userProfile.save();
        }

        return res.status(200).json({ success: true, data: userProfile });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user profile." });
    }
};

const saveUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        console.log("Request Body:", req.body); // Debugging log
        console.log("Uploaded File:", req.file); // Debugging log

        let { fullName, email, phoneNumber, gender, dob, location, maritalStatus } = req.body;
        
        // Convert `dob` from string to Date
        if (dob) {
            dob = new Date(dob);
            if (isNaN(dob)) {
                return res.status(400).json({ success: false, message: "Invalid date format." });
            }
        }

        // Handle profile image if uploaded
        let profileImage = req.file ? `/uploads/${req.file.filename}` : req.body.profileImage;

        if (!fullName || !email || !phoneNumber || !gender || !dob || !location || !maritalStatus) {
            return res.status(400).json({ success: false, message: "All required fields must be provided." });
        }

        let userProfile = await UserProfile.findOne({ userId });

        if (userProfile) {
            userProfile.fullName = fullName;
            userProfile.email = email;
            userProfile.phoneNumber = phoneNumber;
            userProfile.gender = gender;
            userProfile.dob = dob;
            userProfile.location = location;
            userProfile.maritalStatus = maritalStatus;

            if (profileImage) {
                userProfile.profileImage = profileImage;
            }

            await userProfile.save();
            return res.status(200).json({ success: true, message: "Profile updated successfully.", data: userProfile });
        }

        // If user profile does not exist, create a new one
        const newUserProfile = new UserProfile({
            userId,
            fullName,
            email,
            phoneNumber,
            gender,
            dob,
            location,
            maritalStatus,
            profileImage
        });

        await newUserProfile.save();
        res.status(201).json({ success: true, message: "Profile saved successfully.", data: newUserProfile });

    } catch (error) {
        console.error("Error saving user profile:", error);
        res.status(500).json({ success: false, message: "Failed to save user profile." });
    }
};


module.exports = { getProfile, saveProfileAndFamilyInfo, uploadProfileImage,getUserProfile,saveUserProfile };
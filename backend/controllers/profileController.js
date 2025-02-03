const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const { v4: uuidv4 } = require("uuid"); // ✅ Import UUID generator
const User = require("../models/User");

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
      console.log(userId,'11111111111111111111')

      if (!userId) {
          return res.status(400).json({ success: false, message: "User ID is required" });
      }

      console.log("Received request data:", req.body);

      let { fullName, email, phoneNumber, gender, dob, location, maritalStatus, profileImage,
          spouse, marriageAnniversary, father, mother, parentAnniversary, siblings, hasChildren, children } = req.body;

      const parseJSON = (data) => {
          try { return typeof data === "string" ? JSON.parse(data) : data; } 
          catch (error) { return []; }
      };

      spouse = parseJSON(spouse);
      marriageAnniversary = parseJSON(marriageAnniversary);
      father = parseJSON(father);
      mother = parseJSON(mother);
      parentAnniversary = parseJSON(parentAnniversary);
      siblings = parseJSON(siblings) || [];
      children = parseJSON(children) || [];

      // ✅ Fix: Ensure dob is present
      if (!dob || dob.trim() === "") {
          return res.status(400).json({ success: false, message: "Date of birth (dob) is required." });
      }

      // ✅ Fix: Ensure gender is provided
      if (!gender || gender.trim() === "") {
          return res.status(400).json({ success: false, message: "Gender is required." });
      }

      if (spouse) spouse.uniqueId = spouse.uniqueId || uuidv4();
      siblings = siblings.map(sib => ({
          uniqueId: sib.uniqueId || uuidv4(),
          name: sib.name || "Unknown",
          dob: sib.dob || new Date("2000-01-01"), // Default value if missing
          gender: sib.gender || "Other",
          image: sib.image || null
      }));

      children = children.map(child => ({
          uniqueId: child.uniqueId || uuidv4(),
          name: child.name || "Unknown",
          dob: child.dob || new Date("2000-01-01"), // Default value if missing
          image: child.image || null
      }));

      if (req.file) {
          profileImage = `/uploads/${req.file.filename}`;
      }

      let profile = await Profile.findOne({ userId });

      if (profile) {
          profile = await Profile.findOneAndUpdate(
              { userId },
              { fullName, email, phoneNumber, gender, dob, location, maritalStatus, profileImage,
                spouse, marriageAnniversary, father, mother, parentAnniversary, hasChildren, siblings, children },
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

module.exports = { getProfile, saveProfileAndFamilyInfo, uploadProfileImage };

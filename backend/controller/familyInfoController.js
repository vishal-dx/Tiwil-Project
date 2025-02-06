const FamilyInfo = require("../models/FamilyInfo");
const Event = require("../models/EventSchema");

// Fetch Family Information
const getFamilyInfo = async (req, res) => {
  try {
    const userId = req.user.userId; // Assume userId is attached to the request object
    const familyInfo = await FamilyInfo.findOne({ userId });
    if (!familyInfo) {
      return res.status(404).json({ success: false, message: "Family information not found." });
    }
    res.status(200).json({ success: true, data: familyInfo });
  } catch (error) {
    console.error("Error fetching family info:", error);
    res.status(500).json({ success: false, message: "Failed to fetch family information." });
  }
};

// Save or Update Family Information
// const saveFamilyInfo = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const {
//       father,
//       mother,
//       parentAnniversary,
//       spouse,
//       marriageAnniversary,
//       hasChildren,
//       numberOfChildren,
//       children,
//       siblings,
//     } = req.body;

//     let familyInfo = await FamilyInfo.findOne({ userId });

//     if (familyInfo) {
//       // Update existing family information
//       familyInfo.father = father || familyInfo.father;
//       familyInfo.mother = mother || familyInfo.mother;
//       familyInfo.parentAnniversary = parentAnniversary || familyInfo.parentAnniversary;
//       familyInfo.spouse = spouse || familyInfo.spouse;
//       familyInfo.marriageAnniversary = marriageAnniversary || familyInfo.marriageAnniversary;
//       familyInfo.hasChildren = hasChildren || familyInfo.hasChildren;
//       familyInfo.numberOfChildren = numberOfChildren || familyInfo.numberOfChildren;
//       familyInfo.children = children || familyInfo.children;
//       familyInfo.siblings = siblings || familyInfo.siblings;

//       await familyInfo.save();
//       return res.status(200).json({ success: true, message: "Family information updated successfully.", data: familyInfo });
//     }

//     // Create new family information
//     familyInfo = new FamilyInfo({
//       userId,
//       father,
//       mother,
//       parentAnniversary,
//       spouse,
//       marriageAnniversary,
//       hasChildren,
//       numberOfChildren,
//       children,
//       siblings,
//     });

//     await familyInfo.save();
 
//     res.status(201).json({ success: true, message: "Family information saved successfully.", data: familyInfo });
//   } catch (error) {
//     console.error("Error saving family info:", error);
//     res.status(500).json({ success: false, message: "Failed to save family information." });
//   }
// };




// const FamilyInfo = require("../models/FamilyInfo");
// const Event = require("../models/EventSchema");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed!"), false);
  }
};

// Allow **one** field named "images" to accept multiple files
const familyUpload = multer({
  storage,
  fileFilter,
}).array("images", 20);
// Configure multer for file upload
const calculateDaysLeft = (date) => {
  const today = new Date();
  const eventDate = new Date(date);
  const diffTime = eventDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Save or Update Family Information and Events
const saveFamilyInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(req.body, "//////////////////////////////////////////..");

    // Ensure `req.body.data` is properly parsed
    let data;
    try {
      data = req.body.data ? JSON.parse(req.body.data) : {};
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      return res.status(400).json({ success: false, message: "Invalid JSON format in request body." });
    }

    const files = req.files || [];
    console.log("Received Data:", JSON.stringify(data, null, 2));
    console.log("Uploaded Files:", files);

    let {
      father = {},
      mother = {},
      parentAnniversary = {},
      spouse = {},
      marriageAnniversary = {},
      hasChildren = false,
      numberOfChildren = 0,
      children = [],
      siblings = [],
    } = data;

    // ✅ Function to format paths properly (Windows -> URL-friendly)
    const formatPath = (filePath) => (filePath ? filePath.replace(/\\/g, "/") : null);

    // **Attach images dynamically**
    if (files.length > 0) {
      if (files[0]) father.image = formatPath(files[0].path);
      if (files[1]) mother.image = formatPath(files[1].path);
      if (files[2]) parentAnniversary.image = formatPath(files[2].path);
      if (files[3]) spouse.image = formatPath(files[3].path);
      if (files[4]) marriageAnniversary.image = formatPath(files[4].path);

      children = children.map((child, index) => ({
        ...child,
        image: formatPath(files[5 + index]?.path),
      }));

      siblings = siblings.map((sibling, index) => ({
        ...sibling,
        image: formatPath(files[5 + children.length + index]?.path),
      }));
    }

    let familyInfo = await FamilyInfo.findOne({ userId });

    if (familyInfo) {
      // ✅ Use Mongoose `set()` to ensure fields are properly updated
      familyInfo.set({
        father: { ...familyInfo.father, ...father },
        mother: { ...familyInfo.mother, ...mother },
        parentAnniversary: { ...familyInfo.parentAnniversary, ...parentAnniversary },
        spouse: { ...familyInfo.spouse, ...spouse },
        marriageAnniversary: { ...familyInfo.marriageAnniversary, ...marriageAnniversary },
        hasChildren,
        numberOfChildren,
        children: children.length > 0 ? children : familyInfo.children,
        siblings: siblings.length > 0 ? siblings : familyInfo.siblings,
      });

      await familyInfo.save();

      // ✅ Generate and store event data for this user
      await generateEvents(userId, familyInfo);

      console.log("Updated Family Info:", JSON.stringify(familyInfo, null, 2));

      return res.status(200).json({
        success: true,
        message: "Family information updated successfully.",
        data: familyInfo,
      });
    }

    // ✅ If no existing record, create a new one
    familyInfo = new FamilyInfo({
      userId,
      father,
      mother,
      parentAnniversary,
      spouse,
      marriageAnniversary,
      hasChildren,
      numberOfChildren,
      children,
      siblings,
    });

    await familyInfo.save();

    // ✅ Generate and store event data
    await generateEvents(userId, familyInfo);

    console.log("Saved New Family Info:", JSON.stringify(familyInfo, null, 2));

    res.status(201).json({
      success: true,
      message: "Family information saved successfully.",
      data: familyInfo,
    });
  } catch (error) {
    console.error("Error saving family info:", error);
    res.status(500).json({ success: false, message: "Failed to save family information." });
  }
};
  




// Function to generate events
const generateEvents = async (userId, familyInfo) => {
  const events = [];

  // Function to calculate remaining days
  const calculateDaysLeft = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Add father and mother birthdays
  if (familyInfo.father?.dob) {
    events.push({
      userId,
      name: `${familyInfo.father.name}'s Birthday`,
      date: familyInfo.father.dob,
      relation: "Father",
      daysLeft: calculateDaysLeft(familyInfo.father.dob),
      image: familyInfo.father.image,
    });
  }

  if (familyInfo.mother?.dob) {
    events.push({
      userId,
      name: `${familyInfo.mother.name}'s Birthday`,
      date: familyInfo.mother.dob,
      relation: "Mother",
      daysLeft: calculateDaysLeft(familyInfo.mother.dob),
      image: familyInfo.mother.image,
    });
  }

  // Add parent's anniversary
  if (familyInfo.parentAnniversary?.date) {
    events.push({
      userId,
      name: "Parent's Anniversary",
      date: familyInfo.parentAnniversary.date,
      relation: "Parent Anniversary",
      daysLeft: calculateDaysLeft(familyInfo.parentAnniversary.date),
      image: familyInfo.parentAnniversary.image,
    });
  }

  // Add spouse events
  if (familyInfo.spouse?.dob) {
    events.push({
      userId,
      name: `${familyInfo.spouse.name}'s Birthday`,
      date: familyInfo.spouse.dob,
      relation: "Spouse",
      daysLeft: calculateDaysLeft(familyInfo.spouse.dob),
      image: familyInfo.spouse.image,
    });
  }

  if (familyInfo.marriageAnniversary?.date) {
    events.push({
      userId,
      name: "Marriage Anniversary",
      date: familyInfo.marriageAnniversary.date,
      relation: "Marriage Anniversary",
      daysLeft: calculateDaysLeft(familyInfo.marriageAnniversary.date),
      image: familyInfo.marriageAnniversary.image,
    });
  }

  // Add children's birthdays
  familyInfo.children.forEach((child) => {
    if (child.dob) {
      events.push({
        userId,
        name: `${child.name}'s Birthday`,
        date: child.dob,
        relation: "Child",
        daysLeft: calculateDaysLeft(child.dob),
        image: child.image,
      });
    }
  });

  // Add siblings' birthdays
  familyInfo.siblings.forEach((sibling) => {
    if (sibling.dob) {
      events.push({
        userId,
        name: `${sibling.name}'s Birthday`,
        date: sibling.dob,
        relation: "Sibling",
        daysLeft: calculateDaysLeft(sibling.dob),
        image: sibling.image,
      });
    }
  });

  // ✅ Save all events to the database
  await Event.deleteMany({ userId }); // Remove old events for this user
  await Event.insertMany(events);
};

// const updateFamilyInfo = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const { relation, name, dob, anniversary } = req.body;
//     let image = null;

//     if (req.file) {
//       image = `uploads/${req.file.filename}`;
//     }

//     const updateField = {};
//     if (relation === "Father") updateField.father = { name, dob, image };
//     if (relation === "Mother") updateField.mother = { name, dob, image };
//     if (relation === "Wife") updateField.spouse = { name, dob, anniversary, image };
//     if (relation.startsWith("Child")) {
//       const childIndex = parseInt(relation.split(" ")[1]) - 1;
//       updateField[`children.${childIndex}`] = { name, dob, image };
//     }
//     if (relation.startsWith("Sibling")) {
//       const siblingIndex = parseInt(relation.split(" ")[1]) - 1;
//       updateField[`siblings.${siblingIndex}`] = { name, dob, image };
//     }

//     const familyInfo = await FamilyInfo.findOneAndUpdate(
//       { userId },
//       { $set: updateField },
//       { new: true }
//     );

//     if (!familyInfo) {
//       return res.status(404).json({ success: false, message: "Family info not found." });
//     }

//     res.status(200).json({ success: true, data: familyInfo });
//   } catch (error) {
//     console.error("Error updating family info:", error);
//     res.status(500).json({ success: false, message: "Failed to update family info." });
//   }
// };

const updateFamilyInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { relation, name, dob, anniversary } = req.body;
    let image = req.file ? `uploads/${req.file.filename}` : null;

    const updateField = {};
    if (relation === "Father") updateField.father = { name, dob, image };
    if (relation === "Mother") updateField.mother = { name, dob, image };
    if (relation === "Wife") updateField.spouse = { name, dob, anniversary, image };
    if (relation.startsWith("Child")) {
      const childIndex = parseInt(relation.split(" ")[1]) - 1;
      updateField[`children.${childIndex}`] = { name, dob, image };
    }
    if (relation.startsWith("Sibling")) {
      const siblingIndex = parseInt(relation.split(" ")[1]) - 1;
      updateField[`siblings.${siblingIndex}`] = { name, dob, image };
    }

    const familyInfo = await FamilyInfo.findOneAndUpdate(
      { userId },
      { $set: updateField },
      { new: true }
    );

    if (!familyInfo) {
      return res.status(404).json({ success: false, message: "Family info not found." });
    }

    const updatedData = await FamilyInfo.findOne({ userId }); // ✅ Fetch full updated data
    res.status(200).json({ success: true, data: updatedData }); // ✅ Send full updated data
  } catch (error) {
    console.error("Error updating family info:", error);
    res.status(500).json({ success: false, message: "Failed to update family info." });
  }
};


module.exports = { getFamilyInfo, saveFamilyInfo, familyUpload, updateFamilyInfo };

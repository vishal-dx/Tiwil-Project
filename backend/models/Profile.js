const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Schema for siblings
const siblingSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    dob: { type: Date, required: true }, // Ensure dob exists
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    image: { type: String }
});

// Schema for children
const childSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    dob: { type: Date, required: true }, // Ensure dob exists
    image: { type: String }
});

// Schema for parents, spouse, and anniversaries
const familyMemberSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    name: { type: String },
    dob: { type: Date }, // Ensure dob exists
    image: { type: String }
});

// Schema for events like anniversaries
const eventSchema = new mongoose.Schema({
    uniqueId: { type: String, default: uuidv4 },
    date: { type: Date },
    image: { type: String }
});

// Main profile schema
const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    dob: { type: Date, required: true }, // ✅ Ensure dob is required
    location: { type: String },
    maritalStatus: { type: String, enum: ["Married", "Unmarried"], required: true },
    profileImage: { type: String },

    father: familyMemberSchema,
    mother: familyMemberSchema,
    spouse: familyMemberSchema,
    marriageAnniversary: eventSchema,
    parentAnniversary: eventSchema,

    hasChildren: { type: Boolean, default: false },
    children: [childSchema],
    siblings: [siblingSchema]
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);

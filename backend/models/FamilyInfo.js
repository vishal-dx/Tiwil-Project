const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: { type: String, required: false },
  dob: { type: Date, required: false },
  image: { type: String, required: false }, // Image field added
});

const siblingSchema = new mongoose.Schema({
  name: { type: String, required: false },
  dob: { type: Date, required: false },
  image: { type: String, required: false }, // Image field added
});

const familyInfoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    father: {
      name: { type: String, required: false },
      dob: { type: Date, required: false },
      image: { type: String, required: false }, // Image field added
    },
    mother: {
      name: { type: String, required: false },
      dob: { type: Date, required: false },
      image: { type: String, required: false }, // Image field added
    },
    parentAnniversary: {
      date: { type: Date, required: false },
      image: { type: String, required: false }, // Image field added
    },
    spouse: {
      name: { type: String, required: false },
      dob: { type: Date, required: false },
      image: { type: String, required: false }, // Image field added
    },
    marriageAnniversary: {
      date: { type: Date, required: false },
      image: { type: String, required: false }, // Image field added
    },
    hasChildren: { type: Boolean, default: false },
    numberOfChildren: { type: Number, default: 0 },
    children: [childSchema], // Child schema already supports image
    siblings: [siblingSchema], // Sibling schema already supports image
  },
  { timestamps: true }
);

module.exports = mongoose.model("FamilyInfo", familyInfoSchema);

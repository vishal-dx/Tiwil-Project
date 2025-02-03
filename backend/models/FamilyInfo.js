// const mongoose = require("mongoose");

// const siblingSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   dob: { type: Date, required: true },
//   gender: { type: String, required: true },
//   image: { type: String, required: false }, 
// });

// const familyInfoSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   father: {
//     name: { type: String, required: false },
//     dob: { type: Date, required: false },
//     image: { type: String, required: false },
//   },
//   mother: {
//     name: { type: String, required: false },
//     dob: { type: Date, required: false },
//     image: { type: String, required: false },
//   },
//   parentAnniversary: {
//     date: { type: Date, required: false },
//     image: { type: String, required: false },
//   },
//   siblings: [siblingSchema], // Array of sibling documents
// });

// module.exports = mongoose.model("FamilyInfo", familyInfoSchema);

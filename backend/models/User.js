const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password:{type:String, required:true},
  role:{type:String, enum:["user", "admin"], default:"user"},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);

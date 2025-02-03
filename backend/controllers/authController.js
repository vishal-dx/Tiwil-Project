const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const OTPModel = require("../models/OTPModel.js");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// **Signup - Step 1: Send OTP**
const sendOTP = async (req, res) => {
  const { email, phoneNumber, password, fullName } = req.body;

  if (!email || !phoneNumber || !password || !fullName) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists. Please log in." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete any existing OTP for the email before storing a new one
    await OTPModel.deleteOne({ email });

    // Store the new OTP in the database
    await OTPModel.create({ email, otp });

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP Code is: ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

// **Signup - Step 2: Verify OTP and Create User**
const verifyOTP = async (req, res) => {
  const { fullName, email, phoneNumber, password, otp } = req.body;

  if (!email || !phoneNumber || !password || !fullName || !otp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const storedOtp = await OTPModel.findOne({ email });

    if (!storedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Remove OTP after successful verification
    await OTPModel.deleteOne({ email });

    // Check again if the user exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but has no password, update with the new password
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        return res.json({ success: true, message: "Password set successfully. You can now log in." });
      }

      return res.status(400).json({ success: false, message: "User already exists. Please log in." });
    }

    // Hash the password before saving a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({ fullName, email, phoneNumber, password: hashedPassword });

    res.json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};


// **Login API (Email & Password)**
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please sign up first." });
    }

    // Check if the user has a password stored
    if (!user.password) {
      return res.status(400).json({ success: false, message: "Password not set for this user. Please reset your password." });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};


module.exports = { sendOTP, verifyOTP, loginUser };

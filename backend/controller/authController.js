const OTPModel = require("../models/OTPModel");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// **Signup: Generate OTP**
const sendSignupOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists. Please log in." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete any existing OTP for this phone number
    await OTPModel.deleteOne({ phoneNumber });

    // Store the new OTP in the database
    await OTPModel.create({ phoneNumber, otp });

    // Send OTP back in the response for demo purposes
    res.json({ success: true, message: "OTP generated successfully", otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ success: false, message: "Error generating OTP" });
  }
};

// **Signup: Verify OTP**
const verifySignupOTP = async (req, res) => {
  const { fullName, email, phoneNumber, otp } = req.body;

  if (!email || !phoneNumber || !fullName || !otp) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const storedOtp = await OTPModel.findOne({ phoneNumber });

    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Remove OTP after successful verification
    await OTPModel.deleteOne({ phoneNumber });

    // Create the user
    const newUser = await User.create({ fullName, email, phoneNumber });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, phoneNumber: newUser.phoneNumber, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "User registered successfully",
      user: { fullName, email, phoneNumber },
      token,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};

// **Login: Generate OTP**
const sendLoginOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist. Please sign up first." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Delete any existing OTP for this phone number
    await OTPModel.deleteOne({ phoneNumber });

    // Store the new OTP in the database
    await OTPModel.create({ phoneNumber, otp });

    // Send OTP back in the response for demo purposes
    res.json({ success: true, message: "OTP generated successfully", otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ success: false, message: "Error generating OTP" });
  }
};

// **Login: Verify OTP**
const loginWithPhone = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  try {
    const storedOtp = await OTPModel.findOne({ phoneNumber });

    if (!storedOtp || storedOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Remove OTP after successful verification
    await OTPModel.deleteOne({ phoneNumber });

    // Check if user exists
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found. Please sign up first." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, phoneNumber: user.phoneNumber, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
};


module.exports = { sendSignupOTP, verifySignupOTP, sendLoginOTP, loginWithPhone };

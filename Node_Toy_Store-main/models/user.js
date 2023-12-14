const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dhzlfojtv/image/upload/v1688486619/th-removebg-preview_uzovfh.png",
    },
    country: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    aboutMe: { type: String },
    phoneNumber: { type: Number },
    userType: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    premiumExpires: Date,
    verificationToken: String,
    verificationTokenExpires: Date,
    resetToken: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

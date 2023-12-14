// controllers/UserController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// GENERATE TOKEN
const generateToken = () => {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000;
  return { token, expires };
};

// RESET PASSWORD
const sendResetEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "uzatmbqqtxzpptku",
    },
  });
  const resetToken = generateToken();
  user.resetToken = resetToken.token;
  user.resetTokenExpires = resetToken.expires;
  await user.save();

  const mailOptions = {
    from: "ttriki50@gmail.com",
    to: user.email,
    subject: "Password Reset",
    text: `
    You are receiving this email because you have requested a password reset.
    Please click on the following link to reset your password: 
    http://localhost:4200/reset-password/${resetToken.token}
    `,
  };

  await transporter.sendMail(mailOptions);
};

const validateEmailAndSendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }

    await sendResetEmail(user);

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    console.log(token);
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token.");
    }

    if (password.length < 8 || !/\d/.test(password)) {
      throw new Error(
        "New password should be at least 8 characters long and contain at least one number"
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Password is incorrect");
    }

    const expiresIn = rememberMe ? "7d" : "1h";

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        userType: user.userType,
        verified: user.verified,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// REGESTRATION WITH VERIFICATION
const sendVerificationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ttriki50@gmail.com",
      pass: "uzatmbqqtxzpptku",
    },
  });
  const verificationToken = generateToken();
  user.verificationToken = verificationToken.token;
  user.verificationTokenExpires = verificationToken.expires;
  await user.save();

  const mailOptions = {
    from: "ttriki50@gmail.com",
    to: user.email,
    subject: "Email Verification",
    text: `
      Thank you for registering. Please click on the following link to verify your email address:
      href="http://localhost:4200/validate-registration/${verificationToken.token}
      `,
  };

  await transporter.sendMail(mailOptions);
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    if (user.verified) {
      throw new Error("Email is already verified");
    }

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verification successful." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { name, email, password, country, city, address } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      country: country,
      city: city,
      address: address,
    });

    await newUser.save();

    await sendVerificationEmail(newUser);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// USER INFORMATIONS
const getUserInfo = async (req, res) => {
  const token = req.headers.authorization;

  try {
    const decodedToken = jwt.verify(token, "secret");
    const userId = decodedToken.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      name: user.name,
      email: user.email,
      userType: user.userType,
      verified: user.verified,
      status: user.status,
      premium: user.premium,
      premiumExpires: user.premiumExpires,
      createdAt: user.createdAt,
      _id: user._id,
      image: user.image,
      country: user.country,
      aboutMe: user.aboutMe,
      phoneNumber: user.phoneNumber,
      city: user.city,
      address: user.address,
      userType: user.userType,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { user, oldPassword, newPassword } = req.body;

  try {
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    existingUser.name = user.name;
    existingUser.image = user.image;
    existingUser.phoneNumber = user.phoneNumber;
    existingUser.aboutMe = user.aboutMe;
    existingUser.country = user.country;
    existingUser.city = user.city;
    existingUser.address = user.address;

    if (oldPassword && newPassword) {
      const match = await bcrypt.compare(oldPassword, existingUser.password);

      if (!match) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      if (newPassword.length < 8 || !/\d/.test(newPassword)) {
        return res.status(400).json({
          message:
            "New password should be at least 8 characters long and contain at least one number",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE EXPIRED TOKENS
const resetExpiredTokens = async () => {
  try {
    const expiredUsers = await User.find({
      resetTokenExpires: { $lt: Date.now() },
    });

    for (let i = 0; i < expiredUsers.length; i++) {
      const user = expiredUsers[i];
      user.resetToken = undefined;
      user.resetTokenExpires = undefined;
      await user.save();
    }

    const resetCount = expiredUsers.length;

    console.log(`${resetCount} users with expired tokens reset.`);
    return { message: `${resetCount} users with expired tokens reset.` };
  } catch (error) {
    console.error("Error resetting expired tokens:", error);
    return { error: "An error occurred while resetting expired tokens." };
  }
};

// DELETE USERS WITH EXPIRED TOKENS
const deleteUsersWithExpiredTokens = async () => {
  try {
    const expiredUsers = await User.find({
      verified: false,
      verificationTokenExpires: { $lt: Date.now() },
    });

    await User.deleteMany({
      verified: false,
      verificationTokenExpires: { $lt: Date.now() },
    });

    const deletedCount = expiredUsers.length;

    console.log(`${deletedCount} users with expired tokens deleted.`);
    return { message: `${deletedCount} users with expired tokens deleted.` };
  } catch (error) {
    console.error("Error deleting users with expired tokens:", error);
    return { error: "An error occurred while deleting users." };
  }
};
// EXECUTE THIS METHODS EVERY HOUR
setInterval(async () => {
  const resetExpiredTokensResult = await resetExpiredTokens();
  console.log(resetExpiredTokensResult);

  const deleteUsersWithExpiredTokensResult =
    await deleteUsersWithExpiredTokens();
  console.log(deleteUsersWithExpiredTokensResult);
}, 60 * 60 * 1000);

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
};

// DELETE SELECTED USERS
const deleteSelectedUsers = async (req, res) => {
  try {
    const { users } = req.body;
    await User.deleteMany({ _id: { $in: users } });
    res.status(200).json({
      message: ` ${users.length} Selected users deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting selected users:", error);
    res.status(500).json({ error: "An error occurred while deleting users." });
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

// SEND MAILS
const sendEmail = async (req, res) => {
  const { userId, subject, text } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ttriki50@gmail.com",
        pass: "uzatmbqqtxzpptku",
      },
    });

    const mailOptions = {
      from: "ttriki50@gmail.com",
      to: user.email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ message: `Email has been sent successfully to ${user.name}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE THE USER STATUS
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    user.status = !status;
    await user.save();

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  getUserById,
  updateUserStatus,
  sendEmail,
  deleteUserById,
  deleteSelectedUsers,
  getAllUsers,

  resetPassword,
  register,
  login,
  validateEmailAndSendResetEmail,
  getUserInfo,
  verifyEmail,
  updateProfile,
};

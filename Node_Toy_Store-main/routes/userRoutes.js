const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.post("/login", UserController.login);
router.get("/userInfo", UserController.getUserInfo);

router.post("/reset-password/:token", UserController.resetPassword);
router.post("/reset-email", UserController.validateEmailAndSendResetEmail);

router.post("/register", UserController.register);
router.post("/verify/:token", UserController.verifyEmail);

router.put("/updateUserProfile", UserController.updateProfile);

router.get("/getUserById/:id", UserController.getUserById);
router.get("/all-users", UserController.getAllUsers);
router.delete("/delete-selected-users", UserController.deleteSelectedUsers);
router.delete("/users/:userId", UserController.deleteUserById);
router.post("/send-email", UserController.sendEmail);
router.put("/user-status", UserController.updateUserStatus);

module.exports = router;

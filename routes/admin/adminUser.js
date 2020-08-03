var express = require("express");
const AdminUserController = require("../../controllers/admin/AdminUserController");

var router = express.Router();

router.post("/register", AdminUserController.register);
router.post("/login", AdminUserController.login);
// router.post("/verify-otp", AuthController.verifyConfirm);
// router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;
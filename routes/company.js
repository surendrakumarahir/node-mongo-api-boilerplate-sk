var express = require("express");
const CompanyController = require("../controllers/CompanyController");

var router = express.Router();

router.post("/register", CompanyController.register);
router.post("/login", CompanyController.login);
// router.post("/verify-otp", AuthController.verifyConfirm);
// router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;
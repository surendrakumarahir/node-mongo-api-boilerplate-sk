var express = require("express");
const emailVarifyController = require("../controllers/EmailVarifyController");

var router = express.Router();

router.put("/:token", emailVarifyController.emailVarify);

module.exports = router;
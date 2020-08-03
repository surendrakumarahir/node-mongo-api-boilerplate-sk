var express = require("express");
const RoleController = require("../../controllers/admin/RoleController");

var router = express.Router();

router.get("/", RoleController.roleList);
router.get("/:id", RoleController.roleDetails);
router.post("/", RoleController.roleAdd);
router.put("/:id", RoleController.roleUpdate);
router.delete("/:id", RoleController.roleDelete);

module.exports = router;
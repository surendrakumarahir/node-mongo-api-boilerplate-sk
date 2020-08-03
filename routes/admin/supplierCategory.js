var express = require("express");
const SupplierCategoryController = require("../../controllers/admin/SupplierCategoryController");

var router = express.Router();

router.get("/", SupplierCategoryController.categoryList);
// router.get("/:id", SupplierCategoryController.categoryDetail);
router.post("/", SupplierCategoryController.categoryAdd);
router.put("/:id", SupplierCategoryController.categoryUpdate);
router.delete("/:id", SupplierCategoryController.categoryDelete);

module.exports = router;
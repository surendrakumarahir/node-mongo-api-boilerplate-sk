var express = require("express");
const UploadController = require("../controllers/UploadController");
const apiResponse = require("../helpers/apiResponse");

var router = express.Router();

router.post("/", UploadController.upload, (error, req, res, next) => {
	return apiResponse.ErrorResponse(res, error.message);
});
// router.get("/:id", BookController.bookDetail);
// router.post("/", BookController.bookStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;
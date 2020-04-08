var express = require("express");
const UploadController = require("../controllers/UploadController");

var router = express.Router();

router.post("/", UploadController.upload);
// router.get("/:id", BookController.bookDetail);
// router.post("/", BookController.bookStore);
// router.put("/:id", BookController.bookUpdate);
// router.delete("/:id", BookController.bookDelete);

module.exports = router;
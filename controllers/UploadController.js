//const Book = require("../models/BookModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
const upload = require("../middlewares/multer");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
var multer = require("multer");
// Book Schema
// function BookData(data) {
// 	this.id = data._id;
// 	this.title= data.title;
// 	this.description = data.description;
// 	this.isbn = data.isbn;
// 	this.createdAt = data.createdAt;
// }

/**
 * Book store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.upload = [
	auth,
	upload.single("upload"),
	(req, res) => {
		try {
			const errors = validationResult(req);
		
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				
			
				return apiResponse.successResponseWithData(res,"uploaded successs", {});
				
				
				//Save book.
				// book.save(function (err) {
				// 	if (err) { return apiResponse.ErrorResponse(res, err); }
				// 	let bookData = new BookData(book);
			   //return apiResponse.successResponseWithData(res,"uploaded successs", {});
				// });
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


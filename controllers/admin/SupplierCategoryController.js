const SupplierCategory = require("../../models/SupplierCategoryModel");
const { body,validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const ac = require("../../middlewares/accesscontroll");
// Category Schema
function categoryData(data) {
	this.id = data._id;
	this.name= data.name;
	this.sub = data.sub;
	this.createdAt = data.createdAt;
}

/**
 * Supplier Category List.
 * 
 * @returns {Object}
 */
exports.categoryList = [
	auth,
	function (req, res) {
		try {
			// const permission = ac.can(req.user.role).readAny("supplierCategory"); 
			// if (permission.granted) {
			SupplierCategory.find({user: req.user._id},"_id name sub createdAt").then((categories)=>{
				if(categories.length > 0){
					console.log(categories);
					return apiResponse.successResponseWithData(res, "Operation success", categories);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
			// } else {
			// 	return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
			// }
			
		} catch (err) {
			//throw error in json response with status 500. 
			console.log("err", err);
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
// exports.bookDetail = [
// 	auth,
// 	function (req, res) {
// 		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
// 			return apiResponse.successResponseWithData(res, "Operation success", {});
// 		}
// 		try {
// 			const permission = ac.can(req.user.role).readOwn("book"); 
// 			if (permission.granted) {
// 				Book.findOne({_id: req.params.id,user: req.user._id},"_id title description isbn createdAt").then((book)=>{                
// 					if(book !== null){
// 						let bookData = new BookData(book);
// 						return apiResponse.successResponseWithData(res, "Operation success", bookData);
// 					}else{
// 						return apiResponse.successResponseWithData(res, "Operation success", {});
// 					}
// 				});
// 			} else {
// 				return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
// 			}
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

/**
 * category Add.
 * 
 * @param {string}      name 
 * @param {Object}      sub
 * 
 * @returns {Object}
 */
exports.categoryAdd = [
	auth,
	body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
	body("sub", "Subcategory must not be empty.").isLength({ min: 1 }),
	(req, res) => {
		try {
            
			const errors = validationResult(req);
			var category = new SupplierCategory(
				{   name: req.body.name,
					user: req.user,
					sub: req.body.sub,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				// const permission = ac.can(req.user.role).createOwn("supplierCategory"); 
				// if (permission.granted) {
				//Save Category.
				category.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let data = new SupplierCategory(category);
					return apiResponse.successResponseWithData(res,"Category add Success.", data);
				});
				// } else {
				// 	return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
				// }
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * category update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.categoryUpdate = [
	auth,
	body("name", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("sub", "Description must not be empty.").isLength({ min: 1 }),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var category = new SupplierCategory(
				{   name: req.body.name,
					user: req.user,
					sub: req.body.sub,
					_id:req.params.id,
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					SupplierCategory.findById(req.params.id, function (err, items) {
						if(items === null){
							return apiResponse.notFoundResponse(res,"Category not exists with this id");
						}else{
							//Check authorized user
							const permission = ac.can(req.user.role).updateAny("supplierCategory"); 
							if (permission.granted) {
								//update category.
								SupplierCategory.findByIdAndUpdate(req.params.id, category, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let data = new categoryData(category);
										return apiResponse.successResponseWithData(res,"Category update Success.", data);
									}
								});
							} else {
								return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
							}
							
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.categoryDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			SupplierCategory.findById(req.params.id, function (err, found) {
				if(found === null){
					return apiResponse.notFoundResponse(res,"Category not exists with this id");
				}else{
					//Check authorized user
					if(found.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete item.
						SupplierCategory.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Category delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
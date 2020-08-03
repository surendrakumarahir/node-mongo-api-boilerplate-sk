const Role = require("../../models/admin/RoleModel");
const { body,validationResult } = require("express-validator");
const apiResponse = require("../../helpers/apiResponse");
const auth = require("../../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const ac = require("../../middlewares/accesscontroll");
// Category Schema
function RoleData(data) {
	this.id = data._id;
	this.name = data.name;
	this.resource = data.resource;
	this.roleType = data.roleType;
	this.createdAt = data.createdAt;
}

/**
 * Role List.
 * 
 * @returns {Object}
 */
exports.roleList = [
	auth,
	function (req, res) {
		try {
			// const permission = ac.can(req.user.role).readAny("supplierCategory"); 
			// if (permission.granted) {
			Role.find({}, "_id name resource roleType createdAt").then((data)=>{
				if(data.length > 0){
					console.log(data);
					return apiResponse.successResponseWithData(res, "Operation success", data);
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
 * Role Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.roleDetails = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			// const permission = ac.can(req.user.role).readOwn("book"); 
			// if (permission.granted) {
			Role.findOne({_id: req.params.id},"_id name resource roleType createdAt").then((result)=>{                
				if(result !== null){
					let data = new RoleData(result);
					return apiResponse.successResponseWithData(res, "Operation success", data);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
			// } else {
			// 	return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
			// }
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Role Add.
 * 
 * @param {string}      name 
 * @param {Object}      sub
 * 
 * @returns {Object}
 */
exports.roleAdd = [
	auth,
	 body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
	body("resource", "Resource must not be empty.").isLength({ min: 1 }),
	body("roleType", "Role type must not be empty").isLength({min: 1}),
	(req, res) => {
		try {
            
			const errors = validationResult(req);
			var role = new Role(
				{   
					name: req.body.name,
					resource: req.body.resource,
					roleType: req.body.roleType,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				// const permission = ac.can(req.user.role).createOwn("supplierCategory"); 
				// if (permission.granted) {
				//Save Category.
				role.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let data = new RoleData(role);
					return apiResponse.successResponseWithData(res,"Role added Success.", data);
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
 * Role update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
exports.roleUpdate = [
	auth,
	body("name", "Name must not be empty.").isLength({ min: 1 }).trim(),
	body("resource", "Resource must not be empty.").isLength({ min: 1 }),
	body("roleType", "Role type must not be empty").isLength({min: 1}),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var role = new Role(
				{   
					_id: req.params.id,
					name: req.body.name,
					resource: req.body.resource,
					roleType: req.body.roleType,
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Role.findById(req.params.id, function (err, items) {
						if(items === null){
							return apiResponse.notFoundResponse(res,"Role not exists with this id");
						}else{
							//Check authorized user
							// const permission = ac.can(req.user.role).updateAny("supplierCategory"); 
							// if (permission.granted) {
							//update category.
							Role.findByIdAndUpdate(req.params.id, role, {},function (err) {
								if (err) { 
									return apiResponse.ErrorResponse(res, err); 
								}else{
									let data = new RoleData(role);
									return apiResponse.successResponseWithData(res,"Role update Success.", data);
								}
							});
							// } else {
							// 	return apiResponse.ErrorResponse(res, "resource is forbidden for this user/role");
							// }
							
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
 * Role Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.roleDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Role.findById(req.params.id, function (err, found) {
				if(found === null){
					return apiResponse.notFoundResponse(res,"Role not exists with this id");
				}else{
					//Check authorized user
					// if(found.user.toString() !== req.user._id){
					// 	return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					// }else{
					//delete item.
					Role.findByIdAndRemove(req.params.id,function (err) {
						if (err) { 
							return apiResponse.ErrorResponse(res, err); 
						}else{
							return apiResponse.successResponse(res,"Role delete Success.");
						}
					});
					//}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
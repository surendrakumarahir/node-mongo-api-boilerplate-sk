const CompanyModel = require("../models/company/CompanyModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const jwt = require("jsonwebtoken");

exports.emailVarify = [
	(req, res) => {
		try {
			console.log("token:", req.params.token);
			CompanyModel.findOne({temporarytoken: req.params.token}).then(user => {
				if(user) {
					var token = req.params.token;
					console.log("user", user);
					jwt.verify(token, process.env.JWT_SECRET, function(err, decode) {
						if (err) {
							apiResponse.ErrorResponse(req, "Activation link has expired.");
						} else {
							console.log("ready to update");
							CompanyModel.findOneAndUpdate({temporarytoken: req.params.token}, {
								EmailConfirmed: 1,
								temporarytoken: null,
							}, function(err){
								if(err) {
									console.log("error");
									return apiResponse.ErrorResponse(res, err, {});
								} else {
									console.log("success");
									return apiResponse.successResponse(res,"Account confirmed success.", {});
								} 
							});
						
						}
					});
				} else {
					console.log("out side");
					apiResponse.ErrorResponse(res, "Activation link has expired.", {});
				}
              
			});
		} catch (err) {
			//throw error in json response with status 500. 
			// console.log('sfasdfasdf');
			return apiResponse.ErrorResponse(res, err, {});
		}
	}
	
];

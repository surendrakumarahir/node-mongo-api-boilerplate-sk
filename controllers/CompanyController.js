const CompanyModel = require("../models/company/CompanyModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const message = require("../message/company");
const msg = message.validation;
var multer = require("multer");
const uploadFile = require("../middlewares/multer");


/**
 * Company Login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage(msg.email).isEmail().withMessage(msg.emailValid),
	body("password").isLength({ min: 1 }).trim().withMessage(msg.password),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				CompanyModel.findOne({email : req.body.email}).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password,user.password,function (err,same) {
							if(same){
								//Check account confirmation.
								if(user.EmailConfirmed){
									// Check User's account active or not.
									if(user.status) {
										let userData = {
											_id: user._id,
											companyName: user.companyName,
											email: user.email,
											role: user.role,
										};
										//Prepare JWT token for authentication
										const jwtPayload = userData;
										const jwtData = {
											expiresIn: process.env.JWT_TIMEOUT_DURATION,
										};
										const secret = process.env.JWT_SECRET;
										//Generated JWT token with Payload and secret.
										userData.token = jwt.sign(jwtPayload, secret, jwtData);
										return apiResponse.successResponseWithData(res,"Login Success.", userData);
									}else {
										return apiResponse.unauthorizedResponse(res, msg.accountNotActive);
									}
								}else{
									return apiResponse.unauthorizedResponse(res, msg.emailNotConfire);
								}
							}else{
								return apiResponse.unauthorizedResponse(res, msg.emailPassWrong);
							}
						});
					}else{
						return apiResponse.unauthorizedResponse(res, msg.emailPassWrong);
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Company registration.
 *
 * @param {string}      companyName
 * @param {string}      website
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	uploadFile.upload("document", "pdf").fields([{ name: "companyRegistration", maxCount: 1 },
		{ name: "certificates", maxCount: 4 },
		{ name: "sponsorDocument", maxCount: 1 },
		{ name: "anotherDocuments", maxCount: 8 } ]),
	//uploadFile.upload("document", "pdf").single("companyRegistration"),
	//uploadFile.upload("document", "pdf").single("certificates"),
	body("companyName").isLength({ min: 1 }).trim().withMessage(msg.companyName),
	body("website").isLength({ min: 1 }).trim().withMessage(msg.website),
	body("email").isLength({ min: 1 }).trim().withMessage(msg.email)
		.isEmail().withMessage(msg.emailValid).custom((value) => {
			return CompanyModel.findOne({email : value}).then((company) => {
				if (company) {
					return Promise.reject(msg.emailUsed);
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage(msg.password),
	body("registerAddress1").isLength({ min: 1 }).trim().withMessage(msg.registerAddress1),
	body("city").isLength({ min: 1 }).trim().withMessage(msg.city),
	body("state").isLength({ min: 1 }).trim().withMessage(msg.state),    
	body("country").isLength({ min: 1 }).trim().withMessage(msg.country),   
	body("countryOfRegistration").isLength({ min: 1 }).trim().withMessage(msg.ccountryOfRegistration), 
	body("supplierCategories").isLength({ min: 1 }).trim().withMessage(msg.supplierCategories), 
        
	// Sanitize fields.
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			console.log("sdfasd", req.body);
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				//hash input password
				bcrypt.hash(req.body.password,10,function(err, hash) {
					const companyRegistration = req.files["companyRegistration"][0];
					const certificates = req.files["certificates"];
					const sponsorDocument = req.files["sponsorDocument"][0];
					const anotherDocuments = req.files["anotherDocuments"];
					console.log(companyRegistration);
					console.log(certificates);
					let categories  = req.body.supplierCategories;
					const supplierCategories = categories.split(",");
                    
					//Prepare JWT token for authentication
					const jwtPayload = {firstname: req.body.companyName, email: req.body.email };
					const jwtData = {
						expiresIn: process.env.JWT_TIMEOUT_DURATION,
					};
					const secret = process.env.JWT_SECRET;
					//Generated JWT token with Payload and secret.
					const temporarytoken = jwt.sign(jwtPayload, secret, jwtData);
                    
					// Create Company object with escaped and trimmed data
					var company = new CompanyModel(
						{
							companyName: req.body.companyName,
							website: req.body.website,
							email: req.body.email,
							password: hash,
							registerAddress1: req.body.registerAddress1,
							registerAddress2: req.body.registerAddress2,
							city: req.body.city,
							state: req.body.state,
							country: req.body.country,
							countryOfRegistration: req.body.country,
							supplierCategories: supplierCategories,
							sponsor: req.body.sponsor,
							companyRegistration: companyRegistration,
							certificates: certificates,
							sponsorDocument: sponsorDocument,
							anotherDocuments: anotherDocuments,
							temporarytoken: temporarytoken,
						}
					);
					// Html email body
					let html = "<p>Confirm Email by click: http://localhost:3000/emailvarify/"+ temporarytoken +"</p>";
					// Send confirmation email
					mailer.send(
						constants.confirmEmails.from, 
						req.body.email,
						"Confirm Account",
						html
					).then(function(){
						// Save user.
						company.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							return apiResponse.successResponseWithData(res,"Registration Success.", {});
						});
					}).catch(err => {
						console.log(err);
						return apiResponse.ErrorResponse(res,err);
					}) ;
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];



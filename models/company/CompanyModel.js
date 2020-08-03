var mongoose = require("mongoose");

var CompanySchema = new mongoose.Schema({
	companyName: {type: String, required: true},
	website: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	registerAddress1: {type: String, required: true},
	registerAddress2: {type: String, required: true},
	isConfirmed: {type: Boolean, required: true, default: 0},
	EmailConfirmed: {type: Boolean, required: true, default: 0},
	city: {type: String, required: true},
	state: {type: String, required: true},
	country: {type: String, required: true},
	countryOfRegistration: {type: String, required: true},
	sponsor: {type: String},
	supplierCategories: {type: Object},
	companyRegistration: {type: Object},
	certificates: {type: Object},
	sponsorDocument: {type: Object},
	anotherDocuments: {type: Object},
	temporarytoken: {type: String},
	status: {type: Boolean, required: true, default: 1},
	role: {type: String, required: true, default: "company"}
}, {timestamps: true});



module.exports = mongoose.model("Company", CompanySchema);
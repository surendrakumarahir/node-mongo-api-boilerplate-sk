var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	title: {type:String, required: true},
	firstName: {type: String, required: true},
	middleName: {type: String},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	contactNumber: {type: Number, required: true},
	companyId: {type:String, required: true},
	password: {type: String, required: true},
	photoId: {type: Object, required: true},
	proofEmploy: {type: Object, required: true},
	anotherDocuments: {type: Object},
	status: {type: Boolean, required: true, default: 1},
	role: {type: String, required: true, default: "user"}
}, {timestamps: true});

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);
var mongoose = require("mongoose");

var AdminUserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	isConfirmed: {type: Boolean, required: true, default: 1},
	status: {type: Boolean, required: true, default: 1},
	roleId: {type: String, required: true}
}, {timestamps: true});

// Virtual for user's full name
AdminUserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("AdminUser", AdminUserSchema);
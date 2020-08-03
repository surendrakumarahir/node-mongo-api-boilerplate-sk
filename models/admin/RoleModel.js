var mongoose = require("mongoose");

var RoleSchema = new mongoose.Schema({
	name: {type: String, required: true},
	resource: {type: Object, required: true},
	roleType: {type: String, required: true, default: "admin"}
}, {timestamps: true});



module.exports = mongoose.model("Role", RoleSchema);
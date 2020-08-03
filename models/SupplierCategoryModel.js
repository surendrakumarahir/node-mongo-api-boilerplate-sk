var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SupplierSchema = new Schema({
	name: {type: String, required: true},
	 //sub: {type: Object},
	sub: [{
		name: { type: String, default: 1 },
		description: { type: String, default: "", trim: true },
	}],
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("SupplierCategory", SupplierSchema);

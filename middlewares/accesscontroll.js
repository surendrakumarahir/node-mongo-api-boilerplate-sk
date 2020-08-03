const AccessControl = require("accesscontrol");
let grantList = [
	{ role: "admin", resource: "book", action: "create:any", attributes: "*, !views" },
	{ role: "admin", resource: "book", action: "read:any", attributes: "*" },
	{ role: "admin", resource: "book", action: "update:any", attributes: "*, !views" },
	{ role: "admin", resource: "book", action: "delete:any", attributes: "*" },
	{ role: "user", resource: "book", action: "create:own", attributes: "*" },
	{ role: "user", resource: "book", action: "read:any", attributes: "*" },
	{ role: "user", resource: "book", action: "update:own", attributes: "*, !rating, !views" },
	{ role: "user", resource: "book", action: "delete:own", attributes: "*" },
	{ role: "admin", resource: "supplierCategory", action: "create:any", attributes: "*, !views" },
	{ role: "admin", resource: "supplierCategory", action: "read:any", attributes: "*" },
	{ role: "admin", resource: "supplierCategory", action: "update:any", attributes: "*, !views" },
	{ role: "admin", resource: "supplierCategory", action: "delete:any", attributes: "*" },
	// { role: "company", resource: "supplierCategory", action: "create:any", attributes: "*" },
	// { role: "company", resource: "supplierCategory", action: "read:any", attributes: "*" },
	// { role: "company", resource: "supplierCategory", action: "update:any", attributes: "*, !rating, !views" },
	// { role: "company", resource: "supplierCategory", action: "delete:any", attributes: "*" }
];
const ac = new AccessControl(grantList);

module.exports = ac;
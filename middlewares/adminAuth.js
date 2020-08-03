var jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const apiResponse = require("../helpers/apiResponse");
const Role = require("../models/admin/RoleModel");
const getAuth = function (req, res, next) {
  
	let token = req.headers.authorization;
	if(token) {
		token = token.slice(7, token.length);
	}
	
	var urlOrigin = req.originalUrl; 
	let nStr = urlOrigin.substring(1);
	let pathArray = nStr.split("/");
	
	if(pathArray.length > 1) {
		jwt.verify(token, secret, function(err, decoded) {
			if(err) apiResponse.ErrorResponse(res, err);
			
			Role.findById(decoded.roleId, function (err, items) {
				if(items === null){
					return apiResponse.notFoundResponse(res,"Role not exists with this id");
				}else{
					let allow = false;
					const resource = items.resource.filter(function(item){
						return item.path == pathArray[1];        
					});
					if(resource.length > 0) {
						// console.log("dfasd", resource);
						const action = resource[0].action;
						if (req.method == "POST" && action.create) allow = true;
						else if (req.method == "GET" && action.read) allow = true;
						else if (req.method == "PUT" && action.write) allow = true;
						else if (req.method == "DELETE" && action.delete) allow = true;
						console.log("allow", allow);
						if(allow){
							next();
						} else {
							return apiResponse.notFoundResponse(res,"Not allow");
						}
					} else {
						return apiResponse.notFoundResponse(res,"Not allow");
					}
					
				}
			});
		});
	} else {
		next();
	}
	// if(req.user) { 
	//   db.getPerms({role_id: req.user.role_id, resource_id: req.resource.id})
	// 	 .then(function(perms){
	// 		var allow = false;
	// 		//you can do this mapping of methods to permissions before the db call and just get the specific permission you want. 
	// 		perms.forEach(function(perm){
	// 			if (req.method == "POST" && perms.create) allow = true;
	// 			else if (req.method == "GET" && perms.read) allow = true;
	// 			else if (req.method == "PUT" && perms.write) allow = true;
	// 			else if (req.method == "DELETE" && perm.delete) allow = true;
  
	// 		})
	// 		if (allow) next();
	// 		else res.status(403).send({error: 'access denied'});
	// 	 })//handle your reject and catch here
	//  } else res.status(400).send({error: 'invalid token'})
};

module.exports = getAuth;
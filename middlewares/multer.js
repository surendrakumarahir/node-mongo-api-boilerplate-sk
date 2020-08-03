const multer = require("multer");


const uploadFile = function(dest, type) {
	const upload = multer({
		dest: dest,
		limits: {
			fileSize: 1000000
		},
		fileFilter(req, file, cb) {
			if(type === "image") {
				if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
					return cb(new Error("Please upload a image"));
				}
			} else if (type === "pdf") {
			
				if (!file.originalname.match(/\.(pdf|doc)$/)) {
					return cb(new Error("Please upload a PDF document"));
				}
			}
				
			cb(undefined, true);
		}
	});
	return upload;
};


module.exports.upload = uploadFile;
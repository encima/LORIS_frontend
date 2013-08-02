var config = require('../config'),
    fs = require('fs');
/*
 * POST file.
 */

exports.upload = function(req, res){
	console.log('Uploading');
	var file                 = JSON.parse(postData),
        fileRootName         = file.name.split('.').shift(),
        fileExtension        = file.name.split('.').pop(),
        filePathBase         = config.upload_dir + '/',
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath             = fileRootNameWithBase + '.' + fileExtension,
        fileID               = 2,
        fileBuffer;
        
	while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }
    
    file.contents = file.contents.split(',').pop();
    
    fileBuffer = new Buffer(file.contents, "base64");
    
    fs.writeFileSync(filePath, fileBuffer);
    response.statusCode = 200;
    response.end();
};

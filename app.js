
/**
 * Module dependencies.
 */
 
var config = require('./config'),
    fs = require('fs');

var express = require('express')
  , routes = require('./routes')
  //, upload = require('./routes/upload')
  , http = require('http')
  , path = require('path');

var app = express();

app.use(express.bodyParser({ keepExtensions: true, uploadDir: "uploads" })); 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/upload', function(request, response){
	console.log('Uploading');
	console.log("file name", request.files.file.name);                                           
    console.log("file path", request.files.file.path);
	var uploaded             = JSON.parse(request.files.file);
	console.log(uploaded);
/*    var fileRootName         = uploaded.name.split('.').shift(),
        fileExtension        = uploaded.name.split('.').pop(),
        filePathBase         = config.upload_dir + '/',
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath             = fileRootNameWithBase + '.' + fileExtension,
        fileID               = 2,
        fileBuffer;
        
	while (fs.existsSync(filePath)) {
        filePath = fileRootNameWithBase + '(' + fileID + ').' + fileExtension;
        fileID += 1;
    }*/
    
    uploaded.contents = uploaded.contents.split(',').pop();
    
    fileBuffer = new Buffer(uploaded.contents, "base64");
    
    fs.writeFileSync(filePath, fileBuffer);
    response.statusCode = 200;
    response.end();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

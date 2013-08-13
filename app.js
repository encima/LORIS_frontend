
/**
 * Module dependencies.
 */
 
var config = require('./config'),
    local_db = require('./local_db'),
    rds_db = require('./rds_db'),
    fs = require('fs');

var express = require('express')
  , routes = require('./routes')
  , upload = require('./routes/rules/upload')
  , read = require('./routes/rules/read')
  , data = require('./routes/data')
  , rules = require('./routes/rules/rules')
  , gsn = require('./routes/gsn/gsn')
  , rules = require('./routes/rules/rules')
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

local_db.connect();
rds_db.connect();

app.get('/', routes.index); 

app.get('/rules/read', read.read);
app.post('/rules/read', read.readFile)

app.get('/rules/upload', upload.page);
app.post('/api/upload', upload.upload);

app.get('/rules', rules.list);

app.get('/data', data.page);
app.post('/api/locations', data.locations);

app.get('/gsn/vsensor', gsn.vsensor);
app.post('/api/get_vsensor', gsn.vsensor_load);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

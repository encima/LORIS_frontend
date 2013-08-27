
/**
 * Module dependencies.
 */
 
var config = require('./config'),
    local_db = require('./local_db'),
    rds_db = require('./rds_db'),
    fs = require('fs');

var express = require('express')
  , read = require('./routes/rules/read')
  , data = require('./routes/data')
  , pages = require('./routes/pages')
  , rules = require('./routes/rules/index')
  , gsn = require('./routes/gsn/gsn')
  , tools = require('./routes/tools')
  , http = require('http')
  , path = require('path');

var app = express();

//Connect to Databases and handle disconnects

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

app.get('/rules/read', pages.readRule);
app.post('/rules/read', tools.readFile)

app.get('/rules/upload', pages.uploadRule);
app.post('/api/rule/upload', tools.uploadRule);
app.post('/api/rule/delete', tools.deleteRule);

app.get('/rules', pages.listRules);

app.get('/data', data.page);
app.post('/api/locations', data.locations);

app.get('/gsn/vsensor', gsn.vsensor);
app.post('/api/get_vsensor', gsn.vsensor_load);

app.get('/image/upload', pages.uploadImage);
app.post('/api/image/upload', tools.uploadImage);

http.createServer(app).listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});

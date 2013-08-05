
/**
 * Module dependencies.
 */
 
var config = require('./config'),
    fs = require('fs');

var express = require('express')
  , routes = require('./routes')
  , upload = require('./routes/upload')
  , read = require('./routes/read')
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
app.get('/read', read.read);
app.post('/read', read.insert)
//   function(req, res){
//   res.render('read', { title: 'Read File' });
// });
app.get('/upload', upload.page)
app.post('/upload', upload.upload);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

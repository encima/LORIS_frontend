var config = require('../config'),
    db = require('../local_db'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    util = require('util'),
    exif = require('exif2'),
    exiv = require('exiv2'),
    xml2js = require('xml2js'),
    async = require('async'),
    AWS = require('aws-sdk'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

var level = 0;

exports.uploadImage = function(request, response){
  console.log(request);
  console.log('Uploading');
  console.log(request.files);
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  var file = request.files.file;
  var body = request.body;

  var magic = new Magic(mmm.MAGIC_MIME_TYPE);
  magic.detectFile(file.path, function(err, result) {
    if (err) throw err;
    console.log(result);
    if(result == 'image/jpeg') {
      exif(file.path, function(err, obj){
        if(err) throw err;
        console.log(obj);
      });
      
    }
  }); 
  response.statusCode = 200;
  response.redirect('/image/upload');
};

exports.uploadRule = function(request, response){
  console.log("file name", request.files.file.name);                                           
  console.log("file path", request.files.file.path);
  console.log("project", request.body.project);
  var file = request.files.file;
  var body = request.body;

  if(file.name.split('.').pop() == 'drl') {
    var connection = db.initializeConnection();
    connection.query('SELECT MAX(id) AS id FROM rule_uploads;', function(err, rows, field) {
      if(err) throw err;
      var ruleID = rows[0].id + 1;
      var insert = util.format("INSERT INTO rule_uploads VALUES(%d, '%s', '%s', '%s');", ruleID, file.name, file.path, body.project);  
      connection.query(insert, function(err, rows, fields) {
        if(err) throw err;
      });
    });
  }else if(file.name.split('.').pop() == 'JPG') {

  }else if(file.name.split('.').pop() == 'kml') {
    handleKML(file, body.project);
  }

  var magic = new Magic();
  magic.detectFile(file.path, function(err, result) {
    if (err) throw err;
    console.log(result);
  });

  response.statusCode = 200;
  response.redirect('/locations');
};

function handleKML(file, project) {
  fs.readFile(file.path, function(err, result) {
    var parser = new xml2js.Parser();
    parser.parseString(result, function(err, result) {
      iterateKML(result, project);
      fs.unlinkSync(file.path);
      return 'KML Handled';
    });
  });
}

function iterateKML(object, project) {
  var objects = [];
  if(object instanceof Object) {
    Object.keys(object).forEach(function(key) {
      if(object[key] instanceof Object) {
        if('Placemark' in object[key]) {
          readPlacemarks(object[key]['Placemark']);
        }
        iterateKML(object[key], project);
      }
    });
  }
}

function readPlacemarks(placemarks, project) {
    var connection = db.initializeConnection();
    connection.query("SELECT MAX(id) AS id FROM location;", function(err, rows, fields) {
      if(err) throw err;
      var id = 1;
      if(rows[0]['id'] != undefined) {
        id = rows[0]['id'] + 1;
      }
      for(var i = 0; i < placemarks.length; i++) {
        if('Point' in placemarks[i] && placemarks[i]['Point'][0] != undefined) {
          var pmark = [];
          pmark['name'] = placemarks[i]['name'];
          pmark['descrip'] = placemarks[i]['description'];
          pmark['lng'] = placemarks[i]['Point'][0]['coordinates'][0].split(',')[0];
          pmark['lat'] = placemarks[i]['Point'][0]['coordinates'][0].split(',')[1];
          var insert = util.format("INSERT INTO location VALUES(%d, %d, %d, \"%s\", \"%s\");", id++, parseFloat(pmark['lat']), parseFloat(pmark['lng']), pmark['descrip'], project);               
          connection.query(insert, function(err, rows, fields) {
            if(err) throw err;
            console.log(insert);
            console.log('-------');
          });
        }
      }
    });
}

exports.deleteRule = function(request, response) {
  var file = request.body.file;
  var connection = db.initializeConnection();
  var del = util.format("DELETE FROM rule_uploads WHERE path='%s';", file);  
  connection.query(del, function(err, rows, fields) {
    if(err) throw err;
    fs.unlinkSync(file);
    response.json('Rule Deleted');
  });
};

exports.readFile = function(req, res) {
  fs.readFile(req.body.path, 'utf8', function(err, data) {
    var lines = data.split(/\r?\n/);
    res.json(lines);
  });
};

exports.identify = function(req, res) {
  var eventID = req.body.eventID;
  var identification = req.body.identification.toLowerCase();
  var idBy = req.body.idBy;
  var connection = db.initializeConnection();
  var now = new Date();  
  async.series(
    [function(callback) {
      var connection = db.initializeConnection();
      var check = util.format("SELECT id FROM species WHERE name = '%s';", identification);
      connection.query(check, function(err, rows, fields) {
        if(rows.length > 0) {
          console.log(rows);
          callback(null, rows[0]['id']);
        }else{
          connection.query("SELECT MAX(id) as id FROM species;", function(err, rows, field) {
            if(err) throw err;
            var id = 1;
            console.log(id);
            if(rows.length > 0) {
              id = rows[0]['id'] + 1;
            }
            var insert = util.format("INSERT INTO species VALUES(%d, '%s', '');", id, identification);
            console.log(insert);
            connection.query(insert, function(err, rows, fields) {
              if(err) res.json(err);
              callback(null, id);
            })        
          });
        }
      });
    }], 
    function(err, results) {
      var query = util.format("INSERT INTO identification VALUES(%d, '%s-%s-%s', %d, %d);", eventID, now.getFullYear(), now.getMonth(), now.getDay(), idBy, results[0]);
      connection.query(query, function(err, rows, fields) {
        if(err) res.json(err);
        res.json({ content: identification });
      });
  });
};

exports.createDWC = function(req, res) {
  var lat = req.body.latitude;
  var lng = req.body.longitude;
  var img = req.body.img;
  // strip off the data: url prefix to get just the base64-encoded bytes
  var data = img.replace(/^data:image\/\w+;base64,/, "");
  var buf = new Buffer(data, 'base64');
  var date = new Date();
  // var path = './uploads/dwc_' + date.getHours() + '' + date.getMinutes();
  // create folder and write image
  // mkdirp(path, function(err) {
  //   if(err)
  //     throw err;
  //   fs.writeFile(path + '/image.png', buf, function(err) {
  //     if(err)
  //       throw err;
  //   });
  // });

  AWS.config.loadFromPath('./s3.json');
  var s3 = new AWS.S3();
  var prefix = 'https://s3-eu-west-1.amazonaws.com/sitesy/' 
  var file =  date.getTime() + '.png';
  s3.putObject({Bucket: 'sitesy', Key: file, Body: buf, ACL:'public-read'}, function(err, data) {
    if (err) throw err;
    console.log('Uploaded to S3');
    var connection = db.initializeConnection();
    add_loc(connection, lat, lng, function(loc_id) {
      connection.query("SELECT MAX(EVENTID) as id FROM occurrence;", function(err, rows, fields) {
        if(err) throw err;
        var id = 1;
        if(rows.length > 0) id = rows[0]['id'] + 1;
        console.log('Adding occurrence');
        var occ = util.format("INSERT INTO occurrence VALUES(NULL, %d, %d, 'MOVINGIMAGE', '%s', '%s', %d, %d);", date.getTime(), id, date, date, loc_id, 1);
        console.log(occ);
        connection.query(occ, function(err, rows, fields) {
          if(err) throw err;
          var is = util.format("INSERT INTO imageset VALUE(%d, '%s');", id, prefix + file);
          console.log(is);
          connection.query(is, function(err, rows, fields) {
            if(err) throw err;
            res.json('{Created Occurrence ' + id + '};');
          });
        });
      });
    });
  });
  // Create DB connection and update all tables
};

function add_loc(connection, lat, lng, callback) { 
  var check_loc = util.format("SELECT id FROM location WHERE lat=%d AND lng=%d;", lat, lng);
  connection.query(check_loc, function(err,rows,fields) {
    if(err) throw err;
    var id = 1;
    if(rows.length > 0) {
      console.log('loc exists');
      id = rows[0]['id'];
      callback(id);
    }else{
      console.log('creating loc');
      connection.query("SELECT MAX(id) as id from location", function(err, rows, fields) {
        if(err) throw err;
        var loc_id = 1;
        if(rows.length > 0) loc_id = rows[0]['id'] + 1;
        var insert = util.format("INSERT INTO location VALUES(%d, %d, %d, 'NULL', 'NULL');", loc_id, lat, lng);
        connection.query(insert, function(err, rows, fields) {
          if(err) throw err;
          console.log('Created loc');
          callback(loc_id);
        });          
      });
    }
  });
};


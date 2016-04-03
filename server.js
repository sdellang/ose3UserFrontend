//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var app     = express();
var eps     = require('ejs');
var http    = require('http');

app.engine('html', require('ejs').renderFile);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var serviceHost = process.env.MAIL_SERVICE_HOST || 'userservice.apps.gen.local';
var mailPath = process.env.MAIL_SERVICE_PATH || '/ws/parks/findmail'
/*var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
var mongoURLLabel = "";
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
  var mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
  var mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
  var mongoUser = process.env.MONGODB_USER
  if (mongoHost && mongoPort && process.env.MONGODB_DATABASE) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (process.env.MONGODB_USER && process.env.MONGODB_PASSWORD) {
      mongoURL += process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@';
    }
    // Provide UI label that excludes user id and pw

    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + process.env.MONGODB_DATABASE;
    mongoURL += mongoHost + ':' + mongoPort + '/' + process.env.MONGODB_DATABASE;
  }
}
var db = null;
var dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');  
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log("Connected to MongoDB at: " + mongoURL);
  });
};
*/
app.get('/', function (req, res) {
      res.render('index.html', {name: ""});
});

app.get('/searchmail',function (req, res) {
   var path = mailPath +"?email="+req.query.searchmail;
   console.log(serviceHost+path);
   var str = '';
   if (serviceHost) {
        var options = {
            host: serviceHost,
            path: path
        };
        http.request(options,function (response) {

             //another chunk of data has been recieved, so append it to `str`
             response.on('data', function (chunk) {
               str += chunk;
             });

            response.on('end',function() {
                console.log(str);
                console.log(JSON.stringify(str))
                var JSONElements = JSON.parse(str);
                console.log("name "+JSONElements.name)

                res.render('index.html',{name: JSONElements.name})
            });
        }).end();

   }
})

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.use(express.static(__dirname + '/static'));

app.listen(port, ip);
console.log('Server running on ' + ip + ':' + port);
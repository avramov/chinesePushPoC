
// Set up ==================================
var express = require('express');
var app = express();	// create our app w/ express
var mongoose = require('mongoose');	// mongoose for mongodb
var morgan = require('morgan');  // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var path = require('path');

// Configuration ==============================
var port = process.env.PORT || 8080;
var config = require('./config');
mongoose.connect(config.dbUrl);     // connect to mongoDB database on modulus.io

app.use(express.static(path.join(__dirname, "../../client/dist")));  // set the static files location /public/img will be /img for users
app.use(morgan('combined'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(methodOverride());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

require('./app/routes/user.server.routes')(app);
require('./app/routes/denetwork.server.routes')(app);
require('./app/routes/notification.server.routes')(app);
require('./app/routes/heatplant.server.routes')(app);
require('./app/routes/substation.server.routes')(app);
require('./app/routes/core.server.routes')(app);

// listen (start app with node server.js) ===================
app.listen(port);
console.log('app listening on port ' + port);

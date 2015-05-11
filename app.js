var express = require('express');
var config = require('konfig')();

var app = express();

var routes = require('./routes');

app.get ('/:page',    routes);
app.get ('/:base/:page',  routes);


app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);

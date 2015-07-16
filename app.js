var express = require('express');
var config = require('konfig')();
var glob = require('glob');
var timeout = require('connect-timeout');
var favicon = require('serve-favicon');

var app = express();
app.use(timeout('600s'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

var path = process.cwd()+'/routes';
glob.sync('**/*.js',{'cwd':path}).forEach(
    function(file){
        var ns = '/'+file.replace(/\.js$/,'');
        app.use(ns, require(path + ns));
    }
);
app.use('*', function(req, res){
    console.log("Error trying to display route: "+req.path);
    res.status(404).send("Nothing Found");
});


app.listen(config.app.port);


console.log('Express server running on port '+config.app.port);

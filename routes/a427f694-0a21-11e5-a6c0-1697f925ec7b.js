var express = require("express"),
    router = express.Router();
var locks = require('locks');

var mutex = locks.createMutex();
/*
This is the build route
Usage:
deploy.thisisimp.com/a427f694-0a21-11e5-a6c0-1697f925ec7b/:environment/:repository
environment - either "dev" or "prod"
repository - either "frontend" or "api"
 */

router.route("/:env/:repo").get(function(req, res) {
    if (mutex.tryLock()) {
        console.log('We got the lock!');
        var util  = require('util'),
            spawn = require('child_process').spawn;

        if(req.params.env === "dev" && req.params.repo === "frontend"){
            var child = spawn('sh', ['~/frontend/build-frontend-dev.sh']);

            child.stdout.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.stderr.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.on('close', function (code) {
                mutex.unlock();
            });
        }
        else if(req.params.env === "dev" && req.params.repo === "api"){
            var child = spawn('sh', ['~/api/build-api-dev.sh']);
            child.stdout.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.stderr.on('data', function (data) {
                console.log(data.toString('base64'));
                //res.send(data.toString('base64'));
            });

            child.on('close', function (code) {
                mutex.unlock();
            });
        }
        else if(req.params.env === "prod" && req.params.repo === "frontend"){
            var child = spawn('sh', ['~/frontend/build-frontend-prod.sh']);
            child.stdout.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.stderr.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.on('close', function (code) {
                mutex.unlock();
            });
        }
        else if(req.params.env === "prod" && req.params.repo === "api"){
            var child = spawn('sh', ['~/api/build-api-prod.sh']);
            child.stdout.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.stderr.on('data', function (data) {
                res.send(data.toString('base64'));
                console.log(data.toString('base64'));
            });

            child.on('close', function (code) {
                mutex.unlock();
            });
        }
        else{
            console.log("User used route improperly");
            req.status(404).send("Route used improperly");
            mutex.unlock();
        }
    } else {
        console.log('Could not get the lock at this time');
        res.status(500).send("Someone else is building at this time, please wait a few minutes and try again");
    }


});

module.exports = router;
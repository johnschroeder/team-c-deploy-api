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
    console.log("Attempting to get lock");
    if (mutex.tryLock()) {
        console.log('We got the lock!');
        var util  = require('util'),
            spawn = require('child_process').spawn;

        if(req.params.env === "dev" && req.params.repo === "frontend"){
            var child = spawn('sh', ['/home/ubuntu/deploy/frontend/build-frontend-dev.sh']);

            child.stdout.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.stderr.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.on('close', function (code) {
                res.write("Finished building! Grats!");
                console.log("User finished building");
                mutex.unlock();
                res.end();
            });
        }
        else if(req.params.env === "dev" && req.params.repo === "api"){
            var child = spawn('sh', ['/home/ubuntu/deploy/api/build-api-dev.sh']);
            child.stdout.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.stderr.on('data', function (data) {
                console.log(data.toString());
                res.write(data.toString());
            });

            child.on('close', function (code) {
                res.write("Finished building! Grats!");
                console.log("User finished building");
                mutex.unlock();
                res.end();
            });
        }
        else if(req.params.env === "prod" && req.params.repo === "frontend"){
            var child = spawn('sh', ['/home/ubuntu/deploy/frontend/build-frontend-prod.sh']);
            child.stdout.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.stderr.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.on('close', function (code) {
                res.write("Finished building! Grats!");
                console.log("User finished building");
                mutex.unlock();
                res.end();
            });
        }
        else if(req.params.env === "prod" && req.params.repo === "api"){
            var child = spawn('sh', ['/home/ubuntu/deploy/api/build-api-prod.sh']);
            child.stdout.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.stderr.on('data', function (data) {
                res.write(data.toString());
                console.log(data.toString());
            });

            child.on('close', function (code) {
                res.write("Finished building! Grats!");
                console.log("User finished building");
                mutex.unlock();
                res.end();
            });
        }
        else{
            console.log("User used route improperly");
            mutex.unlock();
            req.status(404).send("Route used improperly");
        }
    } else {
        console.log('Could not get the lock at this time');
        res.status(500).send("Someone else is building at this time, please wait a few minutes and try again");
    }


});

module.exports = router;

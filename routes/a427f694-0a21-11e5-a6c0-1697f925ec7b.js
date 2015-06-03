var express = require("express"),
    router = express.Router();


/*
Usage:
deploy.thisisimp.com/a427f694-0a21-11e5-a6c0-1697f925ec7b/:environment/:repository
environment - either "dev" or "prod"
repository - either "frontend" or "api"
 */

router.route("/:env/:repo").get(function(req, res) {
    var util  = require('util'),
        spawn = require('child_process').spawn;

    if(req.params.env === "dev" && req.params.repo === "frontend"){
        var child = spawn('sh', ['~/frontend/build-frontend-dev.sh']);
        child.stdout.pipe(res);
    }
    else if(req.params.env === "dev" && req.params.repo === "api"){
        var child = spawn('sh', ['~/api/build-api-dev.sh']);
        child.stdout.pipe(res);
    }
    else if(req.params.env === "prod" && req.params.repo === "frontend"){
        var child = spawn('sh', ['~/frontend/build-frontend-prod.sh']);
        child.stdout.pipe(res);
    }
    else if(req.params.env === "prod" && req.params.repo === "api"){
        var child = spawn('sh', ['~/api/build-api-prod.sh']);
        child.stdout.pipe(res);
    }
    else{
        req.status("404").send("Route used improperly");
    }
});

module.exports = router;
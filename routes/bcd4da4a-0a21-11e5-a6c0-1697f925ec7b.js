var express = require("express");
var AWS = require("aws-sdk");

var router = express.Router();

/*
This is the deploy route
Usage:
deploy.thisisimp.com/bcd4da4a-0a21-11e5-a6c0-1697f925ec7b/:environment/:repository
environment - either "dev" or "prod"
repository - either "frontend" or "api"
 */

//TODO actually poll the containers before stating deploy is succesful

router.route("/:env/:repo").get(function(req, res) {
    var ecs = new AWS.ECS({apiVersion: '2014-11-13', region:"us-west-2"});
    if(req.params.env === "dev" && req.params.repo === "frontend"){
        redeploy("DevFrontend", req, res);
    }
    else if(req.params.env === "dev" && req.params.repo === "api"){
        redeploy("devAPI", req, res);
    }
    else if(req.params.env === "prod" && req.params.repo === "frontend"){
        redeploy("prod-frontend", req, res);
    }
    else if(req.params.env === "prod" && req.params.repo === "api"){
        redeploy("ProdAPI", req, res);
    }
    else{
        res.status("404").send("Route used improperly");
    }
});

var redeploy = function(name, req, res){
    var ecs = new AWS.ECS({apiVersion: '2014-11-13', region:"us-west-2"});
    ecs.listTasks({serviceName:name}, function(err, data){
        if(err){
            console.error(err);
            res.status(500).send("Error: "+JSON.stringify(err));
        }
        else{
            var len = data.taskArns.length;
            var carryOn = true;
            if(len === 0){
                res.send("No containers are currently set to run");
            }
            for(k in data.taskArns){
                if(!carryOn){
                    break;
                }
                ecs.stopTask({task:data.taskArns[k]}, function(err, data){
                    if(err){
                        console.log(err);
                        res.status(500).send("Error: "+JSON.stringify(err));
                        carryOn = false;
                    }
                    else{
                        console.log(data);
                        if(len-- === 1){
                            res.send("Successfully redeployed cluster");
                        }
                    }
                })
            }
        }
    });
};

module.exports = router;
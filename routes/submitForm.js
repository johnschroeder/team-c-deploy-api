var mysql = require("mysql");
var config = require("konfig")();

var express = require("express");

var router = express.Router();

/*
Usage:
    localhost:50001/submitForm
    localhost:50001/submitForm/jobID/Description/employeeName
    localhost:50001/submitForm/jobID/Description/employeeName/mode

Fields:
    jobID, Description, employeeName: Values to insert
    mode: ("insert" | "create_and_insert")
*/

router.route("/").get(function(req, res) {
    submitForm(req, res);
});

router.route("/:jobID/:Description/:employeeName").get(function(req, res) {
    submitForm(req, res);
});

router.route("/:jobID/:Description/:employeeName/:mode").get(function(req, res) {
    submitForm(req, res);
});

function submitForm(req, res) {
    var mode = req.params.mode || "insert";
    var databaseName = "impDB";

    var tableName = "Entry";
    var tableFields = "(jobID int, Description TEXT, employeeName TINYTEXT)";

    var id = req.params.jobID || "2112";
    var desc = req.params.Description || "A modern day warrior";
    var name = req.params.employeeName || "Tom Sawyer";
    var values = req.params.values || "(" + id + ", '" + desc + "', '" + name + "')";

    var connection = mysql.createConnection({
        host: config.app.mysql.host,
        user: config.app.mysql.user,
        password: config.app.mysql.password
    });

    var queryFunction = function(queryInput, nextQueryFunction) {
        return function() {
            connection.query(queryInput, function(err, result) {
                if (err) {
                    connection.rollback(function() {
                        console.error(err.stack);
                        res.status(503).send("Query Error: " + err.code);
                    });
                } else {
                    if (nextQueryFunction)
                        nextQueryFunction();
                    else {
                        connection.commit(function(err) {
                            if (err) {
                                console.error(err.stack);
                                res.status(503).send("Commit Error: " + err.code);
                            } else {
                                res.send("Success!");
                                connection.end();
                            }
                        });
                    }
                }
            });
        };
    };

    var queryToExecute = function() {
        connection.commit(function(err) {
            if (err) {
                console.error(err.stack);
                res.status(503).send("Commit Error: " + err.code);
            } else {
                res.status(503).send("Error: Mode not recognized");
                connection.end();
            }
        });
    };

    switch (mode) {
        case "insert":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("INSERT INTO " + tableName + " VALUES " + values)
            );
            break;
        case "create_and_insert":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("CREATE TABLE IF NOT EXISTS " + tableName + " " + tableFields,
                    queryFunction("INSERT INTO " + tableName + " VALUES " + values)
                )
            );
            break;
        default:
            break;
    }

    connection.connect(function(err) {
        if (err) {
            console.error(err.stack);
            res.status(503).send("Connection Error: " + err.code);
        } else {
            connection.beginTransaction(function(err) {
                if (err) {
                    console.error(err.stack);
                    res.status(503).send("Begin Transaction Error: " + err.code);
                } else {
                    queryToExecute();
                }
            });
        }
    });
}

module.exports = router;

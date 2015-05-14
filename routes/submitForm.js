var mysql = require("mysql");
var config = require("konfig")();

var express = require("express");

var router = express.Router();

//Request fields:
//    mode: ("insert" | "create", | "create_and_insert")
//    database: Database name
//    table: Table name
//    fields: Table fields (for table creation)
//    values: Values to insert

router.route("/").get(function(req, res) {
    var mode = req.params.mode || "create_and_insert";
    var databaseName = req.params.database || "impDB";
    var tableName = req.params.table || "Entry";
    var tableFields = req.params.fields || "(jobID int, Description TEXT, employeeName TINYTEXT)";
    var values = req.params.values || "(2112, 'A modern day warrior' ,'Tom Sawyer')";

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

    var queryToExecute = function() {};

    switch (mode) {
        case "create_and_insert":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("CREATE TABLE IF NOT EXISTS " + tableName + " " + tableFields,
                    queryFunction("INSERT INTO " + tableName + " VALUES " + values)
                )
            );
            break;
        case "create":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("CREATE TABLE IF NOT EXISTS " + tableName + " " + tableFields)
            );
            break;
        case "insert":
            queryToExecute = queryFunction("USE " + databaseName,
                queryFunction("INSERT INTO " + tableName + " VALUES " + values)
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
});

module.exports = router;

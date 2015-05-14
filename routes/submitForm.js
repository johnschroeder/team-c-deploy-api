var mysql = require("mysql");
var config = require("konfig")();

var express = require("express");

var router = express.Router();

router.route("/").get(function(req, res) {
    var connection = mysql.createConnection({
        host: config.app.mysql.host,
        user: config.app.mysql.user,
        password: config.app.mysql.password
    });

    connection.connect(function(err) {
        if (err) {
            console.error(err.stack);
            res.send("Connection Error: " + err.code);
        } else {
            connection.beginTransaction(function(err) {
                if (err) {
                    console.error(err.stack);
                    res.send("Begin Transaction Error: " + err.code);
                } else {
                    connection.query("USE test", function(err, result) {
                        if (err) {
                            connection.rollback(function() {
                                console.error(err.stack);
                                res.send("Rollback Error: " + err.code);
                            });
                        } else {
                            connection.query("CREATE TABLE IF NOT EXISTS names (id int, name varchar(30))", function(err, result) {
                                if (err) {
                                    connection.rollback(function() {
                                        console.error(err.stack);
                                        res.send("Rollback Error: " + err.code);
                                    });
                                } else {
                                    connection.query("INSERT INTO names VALUES (2112, 'Tom Sawyer')", function(err, result) {
                                        if (err) {
                                            connection.rollback(function() {
                                                console.error(err.stack);
                                                res.send("Query Error: " + err.code);
                                            });
                                        } else {
                                            connection.commit(function(err) {
                                                if (err) {
                                                    console.error(err.stack);
                                                    res.send("Commit Error: " + err.code);
                                                } else {
                                                    res.send("Success!");
                                                    connection.end();
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });    
});

module.exports = router;

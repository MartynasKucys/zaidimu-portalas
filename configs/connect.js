let mysql = require("mysql");


let connection = mysql.createConnection( {
    host: "localhost",
    database: "info",
    user: "root"
});

connection.connect((err) => {
    if(err) throw err;

    console.log("DB connected!");

});

module.exports = connection;
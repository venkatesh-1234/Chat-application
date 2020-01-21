var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'securifi@123',
    database : 'chandu'
});
    connection.connect(function(err) {
      if (err) throw err;
    });

var sqldata={};
sqldata.send=function(data){
    //console.log("database Connected!");
    var sql = "INSERT INTO chat (user,message) VALUES (?,?) ";
    connection.query(sql,[data.user,data.message], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
}
module.exports = sqldata;
var mysql = require("mysql");

var pool = mysql.createPool({
  host: "192.168.1.138", 
  port: 3306, 
  user: "root",
  password: "d123456",
    database: "students", 
  connectionLimit:10//一次创建连接的最大数目，默认值为10
});

//导出
module.exports = pool;

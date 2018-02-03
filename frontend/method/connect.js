var mongoose = require("mongoose");

mongoose.connection.openUri("mongodb://xuewen:xuewen456@localhost:33306/crown"); 

var db = mongoose.connection;

db.on("error", function (error) {  
  console.log("数据库连接失败：" + error); 
}); 

db.once("open", function () {  
  console.log("数据库连接成功");
});
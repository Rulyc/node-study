//引入mysql模块
const mysql=require('mysql');
//创建连接池
var connection = mysql.createPool({      //创建mysql实例
  host:'localhost',
  port:'3306',
  user:'root',
  password:'',
  database:'node_demo'
});
//导出连接池对象
module.exports=connection;

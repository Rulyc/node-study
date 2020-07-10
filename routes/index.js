var express = require('express');
var router = express.Router();
const connection = require('../db/database')

// const bodyParser = require('body-parser') // 引入post请求插件

// const jsonParser = bodyParser.json() // 解析提交的json参数
// const urlencodedParser = bodyParser.urlencoded({ extended: true }) // 解析提交的表单参数

connection.getConnection(function (err,connection) { // 使用连接池
  if(err){
    console.log('与MySQL数据库建立连接失败！');
    console.log('错误信息为：' + err);
  }
  else{
    console.log('与MsSQL数据库建立连接成功！');
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.send('index');
});

router.get('/demo', (req, res, next)=> {
  connection.query('SELECT * FROM student_info', function(err,result){
    // resolve();
    console.log(result)
    res.send(result);
  });
});
// jsonParser,
router.post('/demo', (req, res, next)=> {
  console.log(req.body)
  let name = req.body.name
  let pageSize = req.body.pageSize // 页大小
  let pageCurrent = req.body.pageCurrent // 当前页
  let start=(pageCurrent-1)*pageSize; // 其实位置
  connection.query(`SELECT *  FROM student_info WHERE name LIKE '%${name}%' LIMIT ${start},${pageSize}`,function(err,result){
    if(err) throw err;
    let list = result
    connection.query(`SELECT COUNT(*) AS total FROM student_info`,function(err,result1){
      if(err) throw err;
      console.log(result1[0].total)
      let obj = {
        pageSize: pageSize,
        pageCurrent: pageCurrent,
        total:result1[0].total,
        list: list
      }

      res.send(obj);
    })
  })
});
// router.get('/demo_add', function(req, res, next) {
//   let params = req.query;
//   if(params){
//     console.log(params.name,params.age,params.address,params.id)
//     params.id = 'NULL';
//     console.log(params)
//     connection.query(`INSERT  INTO  student_info  VALUES(${params.name},${params.age},${params.address},${params.id});`, function(err,result){
//       if(err){
//         res.send("新增失败"+err);
//       }else {
//         res.send("新增成功");
//       }
//     });
//   }
// });
  router.post('/demo_add',(req, res, next)=> {
  let params = req.body.val;
  console.log(params)
  if(params){
    params.id = 'NULL';
    connection.query(`INSERT  INTO  student_info  VALUES('${params.name}',${params.age},'${params.address}',${params.id});`, function(err,result){
      if(err){
        res.send("新增失败"+err);
      }else {
        console.log(result,'新增')
        res.send("新增成功");
      }
    });
  }
});
router.post('/demo_update', (req, res, next)=> {
  let params = req.body.val;
  if(params){
    connection.query(`UPDATE student_info SET name='${params.name}',age=${params.age},address='${params.address}' WHERE id=${params.id} ;`, function(err,result){
      if(err){
        res.send("修改失败"+err);
      }else {
        console.log(result,'修改')
        res.send("修改成功");
      }
    });
  }
});
router.delete('/demo_del',(req, res, next)=> {
  let params = req.body.id;
  if(params){
    connection.query(`DELETE  FROM  student_info  WHERE id = ${params} ;`, function(err,result){
      if(err){
        res.send("删除失败"+err);
      }else {
        console.log(result,'删除')
        res.send("删除成功");
      }
    });
  }
})
module.exports = router;

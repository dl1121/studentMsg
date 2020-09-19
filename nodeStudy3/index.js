//引入express对象
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
//导入数据库连接池
var pool = require("./pool");

//创建应用程序对象
var app = express();

//设置静态资源中间件，告诉服务器，指定路径下的资源为静态资源，浏览器端请求静态资源时服务器直接返回，不需要处理接口实现
app.use(express.static("static"));

//请求体数据解析
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * 中间件
 * 实际上就是一个函数，每个请求过来都会执行这个函数
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
/**
 * 创建磁盘引擎对象
 * para1：配置对象
 */
var storage = multer.diskStorage({
  //存储地址，需要提前手动建好
  destination: "static/imgs",
  // 设置文件名，取值为string或function
  // 当始终只有一个文件是，可以采用string，将文件名写死
  //当出现多个文件时（头像上传...）采用function
  // function参数：
  // para1：请求对象；para2：文件对像；para3：回调函数
  filename: function (req, file, cb) {
    var time = Date.now();
    var suffix = "png";
    var arr = file.originalname.split(".");
    var suffix = arr[arr.length - 1];
    var name = time + "." + suffix;
    //调用回调函数，设置图片名  para1:错误信息，通常为空    para2:文件名称
    cb(null, name);

    // 将图片名称以及路径保存到req.body
    req.body.imgUrl = "http://192.168.1.138:8080/imgs/" + name;
  },
});
var upload = multer({
  storage,
});

app.post("/userinfo", upload.single("img"), (req, res) => {
  console.log("接到请求了!!!");
  console.log(req.body);
  pool.query(
    "update admin set nickname=?,phone=?,imgUrl=? where username=?",
    [req.body.nickname, req.body.phone, req.body.imgUrl, "root"],
    (err, result) => {
      console.log(err);
      console.log(result);
    },
    res.json({
      code: 1,
      data: {
        imgUrl: req.body.imgUrl,
      },
    })
  );
});




//处理请求
//添加学生信息
app.post("/add", (req, res) => {
  //获取学生数据(进行请求体数据解析)
  var student = req.body;
  console.log(student);
  // res.setHeader("Access-Control-Allow-Origin", "*");
  //添加到数据库
  pool.query(
    "insert into student(studentName,age,sex,phone)values(?,?,?,?)",
    [student.studentName, student.age, student.sex, student.phone],
    (err, result) => {
      console.log(err);
      console.log(result);
      if (err) {
        res.json({
          code: 0,
        });
        return;
      }
      res.json({
        code: 1,
        data: {
          id: result.insertId,
        },
      });
    }
  );
});

//删除
app.get("/delete", (req, res) => {
  var student = req.query;
  // res.setHeader("Access-Control-Allow-Origin", "*");
  pool.query("delete from student where id=?", [student.id], (err, result) => {
    console.log(err);
    console.log(result);
    if (err) {
      res.json({
        code: 0,
      });
      return;
    }
    res.json({
      code: 1,
    });
  });
});

//查询，获取学生列表
app.get("/students", (req, res) => {
  var page = parseInt(req.query.page || 0);
  var pageSize = req.query.pageSize * 1 || 10;
  //  res.header('Access-Control-Allow-Origin', '*');
  console.log(page, pageSize);
  pool.query(
    "select * from student limit ?,?",
    [page * pageSize, pageSize],
    (err, result) => {
      console.log(err);
      console.log(result);
      if (err) {
        res.json({
          code: 1,
        });
        return;
      }
      res.json({
        code: 0,
        data: result,
      });
    }
  );
});

//修改
app.post("/update", (req, res) => {
  var student = req.body;
  console.log(student);
  pool.query(
    "update student set studentName=?,age=?,sex=?,phone=? where id=?",
    [student.studentName, student.age, student.sex, student.phone, student.id],
    (err, result) => {
      console.log(err);
      console.log(result);
      if (err) {
        res.json({
          code: 0,
        });
        return;
      }
      res.json({
        code: 1,
      });
    }
  );
});

//登录接口
app.post("/login", (req, res) => {
  var admin = req.body;
  console.log(admin);
  pool.query(
    "select password from admin where username=?",
    [admin.username],
    (err, result) => {
      console.log(err);
      console.log(result);
      if (result.length == 0) {
        res.json({
          code: 0,
        });
        return;
      }
      var password = result[0].password;
      if (password == admin.password) {
        res.json({
          code: 2,
        });
        return;
      }
      res.json({
        code: 1,
      });
    }
  );
});

// 数据总数
app.get("/counts", (req, res) => {
  var count = req.query;
  console.log(count);
  pool.query("select count (*) as count from student;", (err, result) => {
    console.log(err);
    if (err) {
      res.json({
        code: 0,
      });
    }
    res.json({
      code: 1,
      data: result,
    });
  });
});

//开启服务器
app.listen(8081, () => {
  console.log("8081端口服务器成功开启!");
});

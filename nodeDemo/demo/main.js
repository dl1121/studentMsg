// 登录
$("form").submit(function (event) {
  // 阻止默认行为
  event.preventDefault();

  // 获取表单数据 ; 表单元素需要有name属性
  var data = $(this).serialize();
  console.log(data);
  $.ajax({
    url: "http://192.168.1.138:8081/login",
    method: "POST",
    data: data,
    success: function (res) {
      if (res.code == 1) {
        layer.msg("密码错误", {
          time: 1000,
        });
      } else if (res.code == 0) {
        layer.msg("账户错误", {
          time: 1000,
        });
      } else if (res.code == 2) {
        layer.msg("登录成功", {
          time: 1000,
        });
        location.href = "./mainPage.html";
      }
      console.log(res);
    },
    fail: function (error) {
      console.log(error);
    },
  });
});

$.ajax({
  method: "get",
  url: "http://192.168.1.138:8081/counts",
  success: function (res) {
    var count = res.data[0].count;
    // 分页
    layui.use("laypage", function () {
      var laypage = layui.laypage;
      //执行一个laypage实例
      laypage.render({
        elem: "demo",
        count: count, //数据总数
        limit: 10,
        theme: "#009688",
        jump: function (obj) {
          var curr = obj.curr - 1;
          var limit = obj.limit;
          $.ajax({
            method: "get",
            url: `http://192.168.1.138:8081/students?page=${curr}&pageSize=${limit}`,
            success: function (res) {
              // console.log(res);
              var data = res.data;
              var htmlStr = "";
              for (var i = 0; i < data.length; i++) {
                var student = data[i];
                htmlStr += `<tr class="layui-anim-fadeout">
                    <td id="id">${student.id}</td>
                    <td id='studentName'>${student.studentName}</td>
                    <td id='sex'>${student.sex}</td>
                    <td id='age'>${student.age}</td>
                    <td id='phone'>${student.phone}</td>
                    <td id="btn">
                      <button class="layui-btn edit"><i class="layui-icon">&#xe642;</i>编辑</button>
                      <button class="layui-btn layui-btn-danger del"><i class="layui-icon">&#xe640;</i>删除</button>
                      <button class="layui-btn layui-btn-normal layui-btn-disabled">查看</button>
                    </td>
                </tr>`;
              }
              $("tbody").html(htmlStr);
              var edits = $(".edit");
              edits.click(function () {
                var id = $(this).parent().parent().children("#id").text();
                var studentName = $(this)
                  .parent()
                  .parent()
                  .children("#studentName")
                  .text();
                var sex = $(this).parent().parent().children("#sex").text();
                var age = $(this).parent().parent().children("#age").text();
                var phone = $(this).parent().parent().children("#phone").text();
                var then = $(this);
                layer.open({
                  type: 1,
                  title: "信息更新",
                  area: ["400px", "400px"],
                  content: $("#InfoUpdate"),
                  btn: ["确认", "取消"],
                  // shadeClose:true,
                  // 数据回显
                  success: function () {
                    $(".id").val(id);
                    $(".studentName").val(studentName);
                    $(".sex").val(sex);
                    $(".age").val(age);
                    $(".phone").val(phone);
                  },
                  // 确定更新数据

                  yes: function (index, layero) {
                    var studentName = $(".studentName").val();
                    var sex = $(".sex").val();
                    var age = $(".age").val();
                    var phone = $(".phone").val();
                    console.log(id, studentName, sex, age, phone);
                    $.post(
                      "http://192.168.1.138:8081/update",
                      {
                        id: id,
                        studentName: studentName,
                        sex: sex,
                        age: age,
                        phone: phone,
                      },
                      function () {
                        layer.close(index);
                        layer.msg("修改成功", {
                          time: 1000,
                        });

                        // 修改后页面数据实时更新
                        then
                          .parent()
                          .parent()
                          .children("#studentName")
                          .text(studentName);
                        then.parent().parent().children("#sex").text(sex);
                        then.parent().parent().children("#age").text(age);
                        then.parent().parent().children("#phone").text(phone);
                        // 清空表单数据
                        $("#reset")[0].reset();
                      }
                    );
                  },
                  btn2: function (index, layero) {
                    layer.close(index);
                    $("#reset")[0].reset();
                  },
                  cancel: function (index) {
                    layer.close(index);
                    $("#reset")[0].reset();
                  },
                });
              });

              //delete
              $(".del").click(function () {
                var studentId = $(this)
                  .parent()
                  .parent()
                  .children("#id")
                  .text();
                console.log(studentId);
                var message = $(this).parent().parent();
                $.ajax({
                  method: "get",
                  url: `http://192.168.1.138:8081/delete?id=${studentId}`,
                  success: function () {
                    layer.msg("删除成功", {
                      time: 1000,
                    });
                    $(message).remove();
                    setTimeout(function () {
                      window.location.reload();
                    }, 500);
                  },
                });
              });

              //新增
              var adds = $(".add");
              adds.click(function () {
                layer.open({
                  type: 1,
                  title: "数据添加",
                  area: ["400px", "400px"],
                  content: $("#InfoUpdate"),
                  btn: ["确认", "取消"],
                  yes: function (index) {
                    var studentName = $(".studentName").val();
                    console.log(studentName);
                    var sex = $(".sex").val();
                    var age = $(".age").val();
                    var phone = $(".phone").val();
                    console.log(studentName, sex, age, phone);
                    $.post(
                      `http://192.168.1.138:8081/add`,
                      {
                        studentName: studentName,
                        sex: sex,
                        age: age,
                        phone: phone,
                      },

                      function () {
                        console.log("添加成功");
                        layer.close(index);
                        layer.msg("添加成功", {
                          time: 2000,
                        });
                        // 重置表单数据
                        $("#reset")[0].reset();

                        setTimeout(function () {
                          window.location.reload();
                        }, 500);
                      }
                    );
                  },
                  btn2: function (index, layero) {
                    layer.close(index);
                  },
                });
              });
            },
          });
        },
      });
    });
  },
});

$("form").submit(function (e) {
  e.preventDefault();
  var data = new FormData(this);
  console.log(data);
  $.ajax({
    url: "http://192.168.1.138:8081/userinfo",
    method: "post",
    data,
    // 内容类型，默认值为application/x-www-form-urlencded ,填写false，指不采用默认类型
    contentType: false,
    //processData 填写false 指不处理数据，采用数据本身类型
    processData: false,
    success: function (res) {
      console.log("发送成功");
      var img = res.data.imgUrl;
      localStorage.setItem("img", img);
      $("#imgs", parent.document).attr("src", res.data.imgUrl);
       layer.msg("修改成功！", { time: 1000 });
    },
  });
});

// 修改文件提交框样式
$(document).ready(function(){
    $('#test1').click(function(){
        $('#upl').click();
    });

});
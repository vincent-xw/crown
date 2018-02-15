$(function() {
  // WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";

  var ws = new WebSocket("ws://127.0.0.1:8888/");

  ws.onopen = function (e) {
    
    console.log("连接成功");
  };

  ws.onmessage = function (e) {
    // Receives a message.
    var data = JSON.parse(e.data);
    console.log(data);
    
    // 设置开奖状态
    randerData(data);

  };
  ws.onclose = function () {
    console.log("结束");

    $("#nextTip").html("下次开奖倒计时:").removeClass("opening");
    
  };
  
  function randerData(obj) {
    if(obj.status != 4){

      $(".priseArr p").html("");
      $("#firstPrise").html(" ");
      $("#secondPrise").html(" ");
      $("#thirdPrise").html(" ");
      $("#nextTip").html("正在开奖:").addClass("opening");
      for (var index = 0; index < obj.speciallyPrise.length; index++) {
        const element = "<p>" + obj.speciallyPrise[index].number + "</p>";
        $(".priseArr").eq(index).html(element);
      }
      for (var index = 0; index < obj.comfortPrise.length; index++) {
        const element = "<p>" + obj.comfortPrise[index].number + "</p>";
        $(".priseArr").eq(13 + index).html(element);
      }
      if (obj.firstPrise) {
        $("#firstPrise").html(obj.firstPrise.number);
        $(".priseArr").eq(obj.firstPrise.index).html("<p>" + "----" + "</p>");
      }
      if (obj.secondPrise) {
        $("#secondPrise").html(obj.secondPrise.number);
        $(".priseArr").eq(obj.secondPrise.index).html("<p>" + "----" + "</p>");
      }
      if (obj.thirdPrise) {
        $("#thirdPrise").html(obj.thirdPrise.number);
        $(".priseArr").eq(obj.thirdPrise.index).html("<p>" + "----" + "</p>");
      }
      if (obj.isEnd){
        $("#nextTip").html("本次开奖结束").removeClass("opening");
      }
    }
    
  }
});
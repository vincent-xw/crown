$(function() {
  // WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";

  // Write your code in the same way as for native WebSocket:
  var ws = new WebSocket("ws://127.0.0.1:8888/");

  ws.onopen = function () {
    console.log("开始");
    $("#nextTip").html("正在开奖:").addClass("opening");

    $(".priseArr p").html("");
    $("#firstPrise").html("");
    $("#secondPrise").html("");
    $("#thirdPrise").html("");
  };

  ws.onmessage = function (e) {
    // Receives a message.
    let data = JSON.parse(e.data);
    console.log(data);
    
    // 设置开奖状态

  };
  ws.onclose = function () {
    console.log("结束");

    $("#nextTip").html("开奖结束:").removeClass("opening");
  };
  
});
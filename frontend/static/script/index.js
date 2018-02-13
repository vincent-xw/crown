$(function() {
  WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";

  // Write your code in the same way as for native WebSocket:
  var ws = new WebSocket("ws://127.0.0.1:8888/");
  ws.onmessage = function (e) {
    // Receives a message.
    console.log(e.data);
  };
  ws.onclose = function () {
    console.log("closed");
  };
  console.log(111);
  
});
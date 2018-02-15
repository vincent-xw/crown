module.exports = (wss,data)=>{
  const WebSocket = require('ws');
  wss.clients.forEach(function each(client) {
    console.log("client.readyState"+client.readyState);
    console.log("WebSocket.OPEN"+WebSocket.OPEN);
    
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      
    }
  });
};
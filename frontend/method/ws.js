module.exports = (wss,data)=>{
  const WebSocket = require('ws');
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      
    }
  });
};
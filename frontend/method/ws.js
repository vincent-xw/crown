module.exports = (wss,data)=>{
  const WebSocket = require('ws');
  // console.log(wss.clients.length);
  wss.clients.forEach(function each(client) {
    
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      
    }
  });
};

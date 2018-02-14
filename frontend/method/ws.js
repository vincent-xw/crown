module.exports = (obj, cb, wss, status)=>{
  wss.on('connection', function connection(ws, req) {
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    if(obj.status == 1){
      cb(1)
    }else{
      if(status){
        cb(ws);
      }else{
        cb()
      }
    }
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  });
};
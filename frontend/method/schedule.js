module.exports = (wss,liveStatus)=>{
    var schedule = require('node-schedule');

    let livej = schedule.scheduleJob('00 * * * * *', function(){
        
        liveStatus = true;
        require("./live")(wss, liveStatus);
        
    });
    var endj = schedule.scheduleJob('50 * * * * *', function () {
        wss.close();
        liveStatus = false;
    
    });
}
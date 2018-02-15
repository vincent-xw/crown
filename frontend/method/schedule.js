module.exports = (wss,liveStatus)=>{
    var schedule = require('node-schedule');

    let livej = schedule.scheduleJob('05 * * * *', function(){
        
        liveStatus = true;
        require("./live")(wss, liveStatus);
        
    });
    var endj = schedule.scheduleJob('50 * * * *', function () {
        // if(wss){
        //     wss.close();
        // }
        liveStatus = false;
        require("./live")(wss, liveStatus);
    
    });
}
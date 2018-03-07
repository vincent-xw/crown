module.exports = (obj,cb)=>{
    let Lottery = require("./model/lotteryModel");
    // 判定请求时的开奖状态
    let data = {
        _id: new Date(obj.date).toISOString()
    }
    Lottery.findOne(data).then((lottery)=>{
        let result = {};
        if(lottery){
            result = {
                data:lottery
            }
            cb(result);
        }else{
            result = null;
            cb(result);
        }
        
    });
}
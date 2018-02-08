module.exports = (obj,cb)=>{
    let Lottery = require("./model/lotteryModel");
    let data = {
        _id:obj.date
    }
    // let Olottery = new Lottery(data);
    Lottery.findOne(data).then((lottery)=>{
        let result = {};
        if(lottery){
            
            result = {
                data:lottery
            }
        }else{
            result = {
                data:[]
            }
        }
        cb(result);
        
    });
}
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
            result.status = 201;
            // result.data = lottery;
            result.msg = "find Unsuccessful";
            // res.json(result);
        }
        cb(result);
        
    });
}
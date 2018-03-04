module.exports = (obj,cb)=>{
    let Lottery = require("./model/lotteryModel");
    let data = {
        _id: new Date(obj.date).toISOString()
    }
    let today = {
        _id: new Date(new Date().toDateString()).toISOString()
    }
    Lottery.findOne(today).then((lottery)=>{
        let result = {};
        if(lottery){
            
            result = {
                data:lottery
            }
            cb(result);
        }else{
            Lottery.findOne(data).then((lottery) => {
                let result = {};
                if (lottery) {

                    result = {
                        data: lottery
                    }
                } else {
                    result = null;
                }
                cb(result);

            });
        }
        
    });
}
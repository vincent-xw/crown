var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var lotterySchema = new Schema({
    _id: Date,
    period: {
        type: String,
        default: initPeriod()
    },
    date: { type: Date, default: Date.now },//开奖时间
    type: String,//开奖类型
    firstPrise: {// 一等奖
        number: String,
        date: Date,
        msg: String
    },
    secondPrise: {// 二等奖
        number: String,
        date: Date,
        msg: String
    },
    thirdPrise: {// 三等奖
        number: String,
        date: Date,
        msg: String
    },
    speciallyPrise: [
        {
            number: String,
            date: Date,
            msg: String
        }
    ],//特别奖
    comfortPrise: [
        {
            number: String,
            date: Date,
            msg: String
        }
    ]
});
function initPeriod(val){
    let date = new Date(val);
			
    let month =  date.getMonth()>9?date.getMonth()+1:"0"+(date.getMonth()+1);
    let day = date.getDate()>9?date.getDate():"0"+date.getDate();

    return date.getFullYear()+ month + day;
}
lotterySchema.methods.findByDate = function(dateObj,cb){
    if(!dateObj || dateObj == {}){  
        return this.model('Lottery').find().limit(1).sort({"_id":-1});
    }else if(dateObj.startDate && dateObj.endDate){
        return this.model('Lottery').find({"_id":{$gte:new Date(dateObj.startDate),$lte:new Date(dateObj.endDate)}}).limit(dateObj.pageCount || 10).skip((dateObj.pageId-1)*dateObj.pageCount || 0);
    }else{
        return this.model('Lottery').find().limit(dateObj.pageCount || 10).skip((dateObj.pageId-1)*dateObj.pageCount || 0);        
    }
}

var Lottery = mongoose.model('Lottery', lotterySchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(Lottery);
Promise.promisifyAll(Lottery.prototype);

module.exports = Lottery;
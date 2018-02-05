var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var customizeSchema = new Schema({
    _id: Date,
    period: {
        type:String,
        default:initPeriod()
    },
    date: { type: Date, default: Date.now },//设置/更新时间
    firstPrise: {// 一等奖
        number: String,
    },
    secondPrise: {// 二等奖
        number: String,
    },
    thirdPrise: {// 三等奖
        number: String,
    },
    speciallyPrise: [
        {
            number: String,
        }
    ],//特别奖
    comfortPrise: [
        {
            number: String,
        }
    ]
});
function initPeriod(){
    let date = new Date();
			
    let month =  date.getMonth()>9?date.getMonth()+1:"0"+(date.getMonth()+1);
    let day = date.getDate()>9?date.getDate():"0"+date.getDate();

    return date.getFullYear()+ month + day;
}
var Customize = mongoose.model('Customize', customizeSchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(Customize);
Promise.promisifyAll(Customize.prototype);

module.exports = Customize;
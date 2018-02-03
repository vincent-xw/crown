var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var lotterySchema = new Schema({
    _id: Date,
    date: { type: Date, default: Date.now },//开奖时间
    firstPrise: {// 一等奖
        number: Number,
        date: Date
    },
    secondPrise: {// 二等奖
        number: Number,
        date: Date
    },
    thirdPrise: {// 三等奖
        number: Number,
        date: Date
    },
    speciallyPrise: [
        {
            number: Number,
            date: Date
        }
    ],//特别奖
    comfortPrise: [
        {
            number: Number,
            date: Date
        }
    ]
});

var Lottery = mongoose.model('Lottery', lotterySchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(Lottery);
Promise.promisifyAll(Lottery.prototype);

module.exports = Lottery;
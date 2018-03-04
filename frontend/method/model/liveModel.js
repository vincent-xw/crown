var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var liveSchema = new Schema({
  _id: Date,
  period: {
    type: String,
    default: initPeriod()
  },
  date: { type: Date, default: Date.now },//设置/更新时间
  firstPrise: {// 一等奖
    number: String,
    index: Number,
    type:Object,
    default: Object,
  },
  secondPrise: {// 二等奖
    number: String,
    index: Number,
    type:Object,
    default: Object,
  },
  thirdPrise: {// 三等奖
    number: String,
    index: Number,
    type:Object,
    default: Object,
  },
  speciallyPrise: [
    {
      number: String,
      is1Selected: Boolean,
      is2Selected: Boolean,
      is3Selected: Boolean,
    }
  ],//特别奖
  comfortPrise: [
    {
      number: String,
    }
  ],
  isEnd:{
    type:Boolean,
    default:false
  }
});
function initPeriod() {
  let date = new Date();

  let month = date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
  let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

  return date.getFullYear() + month + day;
}
var Live = mongoose.model('Live', liveSchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(Live);
Promise.promisifyAll(Live.prototype);

module.exports = Live;
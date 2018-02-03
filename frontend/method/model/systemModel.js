var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var systemSchema = new Schema({
    type: {// 开奖模式
        type: Number,//1.系统开采，2.自定义开采，3.直播开采
        required: true,
        default:1
    },
    status: {// 开采状态
        type: Number,//1.正在开采，0.暂停开采
        required: true,
        default:1
    }
});

var System = mongoose.model('system', systemSchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(System);
Promise.promisifyAll(System.prototype);

module.exports = System;
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var userSchema = new Schema({
    username: {// 真实姓名
        type: String,
        required: true
    },
    password: {// 密码
        type: String,
        required: true
    }
});

var User = mongoose.model('User', userSchema);
var Promise = require("bluebird");

// Promisify
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;
const express = require('express');
const app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json());

var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(session({
  secret: 'chyingp',  // 用来对session id相关的cookie进行签名
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
      maxAge: 7200 * 1000  // 有效期，单位是毫秒
  }
}));


// 加载hbs模块
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

hbs.registerPartials(__dirname + '/views/partials');

// 加载helper
require("./config/hbs_helper")(hbs);
// 运行hbs模块
app.engine('html', hbs.__express);

app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/static'));

// 引入直播
// let live = require("./method/live")();
// 定时任务
let liveStatus = false;

const WebSocket = require('ws');
let ip = require("ip");

const wss = new WebSocket.Server({ port: 8888, host: ip.address() });

let schedule = require("./method/schedule")(wss,liveStatus);

// mock数据
// let mockData = require("./method/mockData");
// mockData('30');

// 加载接口
let interface_config = require("./method/interface");

interface_config(app,wss);
// 页面路由
var router = require("./config/router");

router(app, express);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
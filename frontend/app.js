const express = require('express');
const app = express();
// 加载hbs模块
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

hbs.registerPartials(__dirname + '/views/partials');

// 运行hbs模块
app.engine('html', hbs.__express);

app.use(express.static(__dirname + '/static'));

var router = require("./config/router");

router(app,express);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
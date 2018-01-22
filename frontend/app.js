const express = require('express');
const app = express();

app.use(express.static('./dashboard/web'));
// 加载hbs模块
var hbs = require('hbs');

// 指定模板文件的后缀名为html
app.set('view engine', 'html');

hbs.registerPartials(__dirname + '/views/partials',function(e){
  console.log(e);
});

// 运行hbs模块
app.engine('html', hbs.__express);

var router = require("./config/router");

router(app,express);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

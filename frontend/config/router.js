module.exports = function(app,express){
    var pageRoute = express.Router({ mergeParams: true });
    var language = require('../translate/translate');
    // 路由匹配

    pageRoute.route('/')
        .get(function(req, res){
            res.render("index",{'index':true,data:language[req.params.language]});
        })
    pageRoute.route('/aboutus')
        .get(function(req, res){
            var lan = req.params;
            res.render("about",{'about':true,data:language[req.params.language]});
        })
    pageRoute.route('/contactus')
        .get(function(req, res){
            var lan = req.params;
            res.render("contact",{'contact':true,data:language[req.params.language]});
        });
    pageRoute.route('*')
        .get(function(req, res){
            var lan = req.params;
            res.render("contact",{'contact':true,data:language[req.params.language]});
        });
    app.use('/zh_cn/', pageRoute);
    app.use('/en_us/', pageRoute);
    app.use('/my/', pageRoute);

    // 首页重定向
    app.get('/', function(req, res){
        res.redirect('/zh_cn/');
    });
    app.use('*', function(req, res){
        res.render('404',{'data':{"bgimg":"404.jpg"}});
      });
    
}
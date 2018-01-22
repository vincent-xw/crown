module.exports = function(app,express){
    var pageRoute = express.Router({ mergeParams: true });
    var language = require('../translate/translate');
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
    app.use('/:language/', pageRoute);
}
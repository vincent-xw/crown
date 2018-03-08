module.exports = function(app,express){
    var pageRoute = express.Router({ mergeParams: true });
    var language = require('../translate/translate');
    // 路由匹配
    pageRoute.route('/')
        .get(function(req, res){
            let date = new Date().toLocaleDateString().replace(/\//g,"-");
            function initPeriod() {
                let date = new Date();

                let month = date.getMonth() > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
                let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

                return date.getFullYear() + month + day;
            };

            let timeStr = new Date().toLocaleDateString() + " 18:15";
            let time = new Date() - new Date(timeStr);

            let data = null;
            let isLive = false, isNormal = true;
            if (time < 0) {
                date = new Date(new Date() - 86400000).toLocaleDateString().replace(/\//g, "-");
            }
            console.log(date);
            
            require("../method/getData")({date:date},(data)=>{
                console.log(data);
                if(!data){
                    isNormal = false;
                    data={
                        data : {
                            period: initPeriod(),
                            firstPrise:{
                                number:"----"
                            },
                            secondPrise:{
                                number:"----"
                            },
                            thirdPrise:{
                                number:"----"
                            },
                            comfortPrise:new Array(10),
                            speciallyPrise: new Array(13),
                        }
                    }
                }

                if (time > 0 && time <= 30 * 60 * 1000) {
                    isLive = true;
                    data = {
                        data: {
                            period: initPeriod(),
                            firstPrise: {
                                number: "----"
                            },
                            secondPrise: {
                                number: "----"
                            },
                            thirdPrise: {
                                number: "----"
                            },
                            comfortPrise: new Array(10),
                            speciallyPrise: new Array(13),
                        }
                    }
                }
                
                // 判定网站语言类型
                let isCn,isEn,isMy;
                if (req.baseUrl.substr(1) == "zh_cn"){
                    isCn = true;
                } else if (req.baseUrl.substr(1) == "en_us"){
                    isEn = true;
                } else {
                    isMy = true;
                }
                // 下次开奖时间
                let nextTime = null;
                let systemInfo = require("../method/model/systemModel");
                systemInfo.findOne().then(sys => {
                    if (sys.status == 1) {
                        nextTime = new Date().toLocaleDateString()+" 18:15:00"
                    }else{
                        nextTime = "Pause";
                    }
                    res.render("index", { 'index': true, 'isLive': isLive, 'isNormal': isNormal, 'nextTime': nextTime, isCn: isCn, isEn: isEn, isMy: isMy, data: language[(req.baseUrl).substr(1)], dataObj: data.data });
                });
                
            });
            
            
        })
    pageRoute.route('/aboutus')
        .get(function(req, res){

            var lan = req.params;
            res.render("about",{'about':true,data:language[(req.baseUrl).substr(1)]});
        })
    pageRoute.route('/contactus')
        .get(function(req, res){
            var lan = req.params;
            res.render("contact",{'contact':true,data:language[(req.baseUrl).substr(1)]});
        });
    pageRoute.route('*')
        .get(function(req, res){
            var lan = req.params;
            res.render("contact",{'contact':true,data:language[(req.baseUrl).substr(1)]});
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
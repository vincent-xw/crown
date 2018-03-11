module.exports = function(app,wss){
    require('./connect');
    // let auth = require('./auth');
    // 登录
    app.post('/api/login', function (req, res) {
        var obj = req.body;
        var sess = req.session;
        
        var result = {
            "status":500,
            "msg":"error"
        };
        let User = require("./model/userModel");

        User.findOne({'username':obj.userName}).then((user)=>{

            // console.log(user);
            if(user){
                
                if(user.password === obj.password){
                    result.status = 200;
                    result.msg = "";
                    sess.userName = user.username;
                    sess.save();
                    // sess.regenerate(function(err) {
                    //     if(err){
                    //         return res.json({status: 2, msg: '登录失败'});                
                    //     }
                                                   
                    // });
                    res.json({ status: 0, msg: '登录成功' });
                }
            }else{
                result.status = 501;
                result.msg = "incorrected userName or password";
                res.json(result);
            }
        });    
    });
    // 注销
    app.get('/api/logout', function(req, res, next){
        req.session.destroy(function(err) {
            if(err){
                res.json({status: 2, msg: '注销失败'});
                return;
            }
            res.clearCookie(identityKey);
            res.json({status: 200,msg:"注销成功"});
        });
    });
    // 验证
    app.get('/api/checklogin', function(req, res, next){
        var sess = req.session;
        
        var loginUser = sess.userName;
        
        var result = {
            "status":500,
            "msg":sess
        };
        if(loginUser){
            result.status = 200;
        }
        res.json(result);
    });
    // 获取自定义配置
    app.get('/api/customize/get', function( req, res){
        let Customize = require("./model/customizeModel");
        let date = new Date().toLocaleDateString().replace(/\//g,'-');
        customize = new Customize();
        
        Customize.findOne({_id:date}).then(cust=>{
            
            let result = {
                status:"200",
                data:cust,
                msg:""
            }
            res.json(result);
        },err=>{
            console.log(err);
            let result = {
                status:"500",
                msg:""
            }
            res.json(result);
        });
    });
    // 插入自定义数据
    app.post('/api/customize/update', function (req, res) {
        var obj = req.body;
        let data = {
            // _id:new Date(),
            _id:obj.date,
            period:obj.period,
            type:'customize',
            firstPrise:obj.firstPrise,
            secondPrise:obj.secondPrise,
            thirdPrise:obj.thirdPrise,
            speciallyPrise:obj.speciallyPrise,
            comfortPrise:obj.comfortPrise,
        };
        var result = {
            "status":500,
            "msg":"error"
        };
        let Customize = require("./model/customizeModel");

        let cust = new Customize(data);
        

        Customize.findOne({"_id":obj.date}).then((customize)=>{
            
            
            if(customize){
                console.log('当前自定义配置存在');
                cust.update(data).then((obj)=>{
                    console.log(obj);
                    
                    if(obj.nModified == 1){
                        result.status = "200";
                        result.msg = "update Successful";
                    }else if(obj.ok == 1 && obj.nModified == 0){
                        result.status = "201";
                        result.msg = "not update";
                    }else{
                        result.status = "201";
                        result.msg = "update unSuccessful";
                    }
                    res.json(result);
                });
            }else{
                console.log('当前自定义配置不存在');
                cust.save(data).then((obj)=>{

                    if(obj){
                        result.status = "200";
                        result.msg = "insert Successful";
                    }else{
                        result.status = "201";
                        result.msg = "insert Unsuccessful";
                    }
                    res.json(result);
                });
            }
        });
    });
    // 获取数据
    app.post('/api/info/get', function(req, res, next){
        
        
        var obj = req.body;
        var result = {
            "status":500,
            data:[],
            "msg":""
        };
        let Lottery = require("./model/lotteryModel");

        let data = {};
        if(obj.pageId&&obj.pageCount){
            data.pageId = obj.pageId;
            data.pageCount = obj.pageCount;
        }
        if(obj.startDate&&obj.endDate){
            data.startDate = obj.startDate;
            data.endDate = obj.endDate;
        }
        let Olottery = new Lottery();
        Olottery.findByDate(data).then((lottery)=>{
            if(lottery){
                let dataCount = {};
                if(data.startDate&&data.endDate){
                    dataCount.startDate = data.startDate;
                    dataCount.endDate = data.endDate;
                } 
                Lottery.count({"_id":{$gte:new Date(dataCount.startDate),$lte:new Date(dataCount.endDate)}}).then(lotteryCount=>{
                    result.status = 200;
                    result.total = lotteryCount;
                    result.pageId = data.pageId || 1;
                    for(let i = 0; i < lottery.length; i ++){
                        let temp = {
                            period:lottery[i].period,
                            date:lottery[i].date,
                            first:lottery[i].firstPrise.number,
                            second:lottery[i].secondPrise.number,
                            third:lottery[i].thirdPrise.number,
                            special:[],
                            comfort:[]
                        };
                        for(let j = 0; j < lottery[i].speciallyPrise.length; j++){
                            temp.special.push(lottery[i].speciallyPrise[j].number);
                        }
                        for(let k = 0; k <  lottery[i].comfortPrise.length; k++){
                            temp.comfort.push(lottery[i].comfortPrise[k].number);
                        }
                        result.data.push(temp);
                    }
                    result.msg = "find Successful";
                    res.json(result);
                });
            }else{
                result.status = 201;
                // result.data = lottery;
                result.msg = "find Unsuccessful";
                res.json(result);
            }
            
        });
    });
    // 前台获取数据
    app.post('/data/get', function (req, res, next) {


        var obj = req.body;
        var result = {
            "status": 500,
            data: [],
            "msg": ""
        };
        let Lottery = require("./model/lotteryModel");
        if (!obj.date || new Date(obj.date) == "Invalid Date"){
            res.json(result);
        }else{
            let data = {
                "_id": new Date(obj.date).toDateString().toISOString()
            };
            Lottery.findOne(data).then((lottery) => {
                if (lottery) {
                    res.data = lottery;
                    res.json(result);
                }

            });
        }
        
    });
    //  获取系统设置
    app.get('/api/setInfo/get', function(req, res, next){

        let system = require("./model/systemModel");
        let result = {
            "status":500,
            "msg":"sess"
        };
        system.find().then(data=>{
            
            result.data = data;
            result.status = 200;
            res.json(result);
        });
    });
    // 修改系统设置
    app.post('/api/setInfo/update', function(req, res, next){
        var obj = req.body;
        let system = require("./model/systemModel");
        let result = {
            "status":500,
            "msg":"sess"
        };
        let data = {
            type:obj.type,
            status:obj.status
        }
        let oSystem = new system(data);
        if(data.type && data.status){
            system.findOneAndUpdate(data).then(data=>{
                if(data){
                    result.msg = "修改成功";
                    result.status = 200;
                    res.json(result);
                }else{
                    oSystem.save().then(res1=>{
                        result.msg = "新增成功";
                        result.status = 200;
                        res.json(result);
                    });
                }
                
            });
        }else{
            result.msg = "缺少参数";
            res.json(result);
        }
        
    });
    // 直播录入数据
    app.post('/api/info/liveInsert', function (req, res, next) {
        var obj = req.body;
        let result = {
            "status": 500,
            "msg": "sess"
        };
        if(true){
            
            let data = {
                number:obj.number,
                type: obj.type,
                index:obj.index,
                isSpecially:obj.isSpecially,
                isComfort:obj.isComfort,
                isFirst: obj.isFirst,
                isSecond: obj.isSecond,
                isThird: obj.isThird,
                isEnd: obj.isEnd,
                specialIndex: obj.specialIndex,
                comfortIndex: obj.comfortIndex,
            }
            let liveSocket = require("./liveSocket");
            liveSocket(wss,data,(resp)=>{
                if(resp.status == 0){
                    result.status = 200;
                    result.data = resp.data;
                    result.msg = resp.msg;
                }else{
                    result.status == 201;
                    result.msg = resp.msg || "未知错误";
                }
                res.json(result);
            })
        }else{
            result.status = 1;
            result.msg = "当前并不是直播时间";
            res.json(result);
        }

    });
    // 检测直播录入状态
    app.post('/api/info/liveStatus', function (req, res, next) {
        var obj = req.body;
        let result = {
            "status": 500,
            "msg": "sess"
        };
        if (true) {
            let systemInfo = require("./model/systemModel");
            let Live = require("./model/liveModel");
            systemInfo.findOne().then(sys => {
                if (sys.status == 1) {
                    let live = new Live();
                    let date = new Date(new Date().toDateString()).toISOString();
                    Live.findOne({ "_id": date }).then(resp => {

                        let result = {
                            status: 0,
                            data: null,
                            msg: ""
                        };
                        if(resp){
                            console.log("检测当前直播设置状态并返回");
                            result.data = resp;
                            if (resp.isEnd) {
                                result.isEnd = true;
                                result.isOk = true;
                            } else {
                                result.isEnd = false;
                                result.isOk = false;
                            }
                            res.json(result);
                        } else {
                            console.log("不存在直播设置，将创建");
                            let livedata = {
                                _id: new Date().toLocaleDateString().replace(/\//g, '-'),
                                type: 'live',
                                firstPrise: {
                                    number:"****",
                                    index:-100,
                                },
                                secondPrise: {
                                    number:"****",
                                    index:-100,
                                },
                                thirdPrise: {
                                    number:"****",
                                    index:-100,
                                },
                                speciallyPrise: [
                                   
                                ],
                                comfortPrise: [
                                    
                                ],
                            }
                            let result = {
                                status: 0,
                                data: null,
                                msg: ""
                            }
                            let createLive = new Live(livedata);
                            // console.log(createLive);
                            
                            createLive.save().then(res1 => {
                                Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                                    result.data = res2;
                                    res.json(result);
                                });
                            }).catch(err => {
                                if (err) {
                                    console.log(err);
                                    result.status = 1;//创建失败
                                    result.msg = "创建失败";
                                    res.json(result);
                                }
                            })
                        }
                    });
                } else {
                    let result = {
                        status: 1,
                        data: null,
                        msg: "当前非直播时间"
                    };
                    res.json(result);
                }
                        
            });
        } else {
            result.status = 1;
            result.msg = "当前并不是直播时间";
            res.json(result);
        }

    });
}
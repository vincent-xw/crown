module.exports = function(app){
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
                    sess.regenerate(function(err) {
                        if(err){
                            return res.json({status: 2, msg: '登录失败'});                
                        }
                        res.json({status: 0, msg: '登录成功'});                           
                    });
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
            res.json({status: 0,msg:"注销成功"});
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
    // 插入自定义数据
    app.post('/api/insert', function (req, res) {
        var obj = req.body;
        let data = {
            // _id:new Date(),
            _id:obj.date,
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
        let Lottery = require("./model/lotteryModel");

        let lott = new Lottery(data);
        

        Lottery.findOne({"_id":obj.date}).then((lottery)=>{
            
            
            if(lottery){
                console.log('已存在');
                lott.update(data).then((obj)=>{
                    if(obj.nModified == 1){
                        result.status = "200";
                        result.msg = "update Successful";
                    }else{
                        result.status = "201";
                        result.msg = "update Unsuccessful";
                    }
                    
                });
            }else{
                console.log('不存在');
                lott.save(data).then((obj)=>{
                    if(obj.nInserted == 1){
                        result.status = "200";
                        result.msg = "insert Successful";
                    }else{
                        result.status = "201";
                        result.msg = "update Unsuccessful";
                    }
                });
            }
        });
    });
    // 获取数据
    app.post('/api/info/get', function(req, res, next){
        var obj = req.body;
        var result = {
            "status":500,
            "msg":"sess"
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
        let lottery = new Lottery();
        lottery.findByDate(data).then((lottery)=>{
            if(lottery){
                result.status = 200;
                result.data = lottery;
                result.msg = "find Successful";
            }else{
                result.status = 201;
                // result.data = lottery;
                result.msg = "find Unsuccessful";
            }
            res.json(result);
            
        });
    });
    //  获取系统设置
    app.get('/api/setInfo/get', function(req, res, next){

        let system = require("./model/systemModel");
        let result = {
            "status":500,
            "msg":"sess"
        };
        system.findOne().then(data=>{
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
        if(data.type && data.status){
            system.findOneAndUpdate(data).then(data=>{
                result.msg = "修改成功";
                result.status = 200;
                res.json(result);
            });
        }else{
            result.msg = "缺少参数";
        }
        
    });
    
}
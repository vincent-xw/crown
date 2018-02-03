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
    // 插入
    app.post('/api/insert', function (req, res) {
        var obj = req.body;
        let data = {
            // _id:new Date(),
            _id:obj.date,
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
                lott.update(data).then((err)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("更新成功");
                    }
                    
                });
            }else{
                console.log('不存在');
                lott.save(data).then((err)=>{
                    if(err){
                        console.log(err);
                        
                    }else{
                        console.log("插入成功");
                        
                    }
                });
            }
        });
    });
}
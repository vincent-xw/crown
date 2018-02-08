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
    // 获取自定义配置
    app.get('/api/customize/get', function( req, res){
        let Customize = require("./model/customizeModel");
        let date = new Date().toLocaleDateString().replace(/\//g,'-');
        customize = new Customize();
        console.log(date);
        
        Customize.findOne({_id:date}).then(cust=>{
            console.log(cust);
            
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
                console.log('已存在');
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
                console.log('不存在');
                cust.save(data).then((obj)=>{
                    if(obj.nInserted == 1){
                        result.status = "200";
                        result.msg = "insert Successful";
                    }else{
                        result.status = "201";
                        result.msg = "update Unsuccessful";
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
    //  获取系统设置
    app.get('/api/setInfo/get', function(req, res, next){

        let system = require("./model/systemModel");
        let result = {
            "status":500,
            "msg":"sess"
        };
        system.find().then(data=>{
            console.log(data);
            
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
                if(data){
                    result.msg = "修改成功";
                    result.status = 200;
                    res.json(result);
                }else{
                    system.save().then(res=>{
                        result.msg = "新增成功";
                        result.status = 200;
                        res.json(result);
                    });
                }
                
            });
        }else{
            result.msg = "缺少参数";
        }
        
    });
    
}
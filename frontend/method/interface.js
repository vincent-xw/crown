module.exports = function(app){
    var mongo = require("./conf");
    // 加入战队
    app.post('/api/joinTeam', function (req, res) {
        var obj = req.body;
        
        mongo().insert(obj,function(resp){
            // console.log(status);
            var result = {
                "status":500,
                "msg":"error"
            };
            if(resp.status == true){
                result.status = 200;
                result.count = resp.msg;
                result.msg = "插入成功";
                
            }else{
                if(resp.msg == "插入失败"){
                    result.status = 500;
                    result.msg = "您已经参加过活动了";
                }else{
                    result.status = 500;
                    result.msg = resp.msg;
                }
                
            }
            res.send(result);
        });
        
            
    });
}
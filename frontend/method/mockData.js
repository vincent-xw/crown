module.exports = ()=>{
    // 测试开奖
    let draw = require("./geneAutoDraw");
    var Mock = require('mockjs');
    let timer = null,counter = 0;

    timer = setInterval(()=>{
        let Lottery = require("./model/lotteryModel");
        let lottery = new Lottery();
        var result = {
            "status":500,
            "msg":"sess"
        };
        lottery.findByDate().then((lott)=>{
            if(lott){
                var obj = Mock.mock({
                    'data|23': [
                        /\d{4,4}/
                    ]
                });
                let data = {
                    status : 1,
                    way : 1,
                    data:obj.data
                };
                let data1 = draw(data);
                let obj1 = {
                    "_id":new Date(new Date(lott[0]._id).getTime()+86400000).toLocaleDateString().replace(/\//g,'-'),
                    "type":'auto',
                    "firstPrise":data1.data.first,
                    "secondPrise":data1.data.second,
                    "thirdPrise":data1.data.third,
                    "speciallyPrise":data1.data.special,
                    "comfortPrise":data1.data.comfort
                };
                
                let lottery1 = new Lottery(obj1);
                lottery1.save().then(function(res){
                    
                        console.log(res);
                    
                });
            }else{
                console.log("查询失败");
            }
            counter ++;
            if(counter == 25){
                clearInterval(timer);
                console.log("结束");
                
            }
        });
    },5000);
    
}
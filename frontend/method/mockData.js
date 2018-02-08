module.exports = ()=>{
    // 测试开奖
    let draw = require("./geneAutoDraw");
    var Mock = require('mockjs');
    let timer = null,counter = 0;
    function initPeriod(val){
        let date = new Date(val);
                
        let month =  date.getMonth()>9?date.getMonth()+1:"0"+(date.getMonth()+1);
        let day = date.getDate()>9?date.getDate():"0"+date.getDate();
    
        return date.getFullYear()+ month + day;
    }
    timer = setInterval(()=>{
        let Lottery = require("./model/lotteryModel");
        let lottery = new Lottery();
        var result = {
            "status":500,
            "msg":"sess"
        };
        lottery.findByDate().then((lott)=>{
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
                "type":'auto',
                "firstPrise":data1.data.first,
                "secondPrise":data1.data.second,
                "thirdPrise":data1.data.third,
                "speciallyPrise":data1.data.special,
                "comfortPrise":data1.data.comfort
            };
            if(lott.length != 0){
                obj1._id = new Date(new Date(lott[0]._id).getTime()+86400000).toLocaleDateString().replace(/\//g,'-');
                obj1.period = initPeriod(obj1._id);
            }else{
                obj1._id = new Date().toLocaleDateString().replace(/\//g,'-');
                obj1.period = initPeriod(obj1._id);
            }
            let lottery1 = new Lottery(obj1);
            lottery1.save().then(function(res){
                
                    // console.log(res);
                
            });
            
            counter ++;
            if(counter == 30){
                clearInterval(timer);
                console.log("结束");
                
            }
        });
    },3000);
    
}
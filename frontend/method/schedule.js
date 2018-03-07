module.exports = (wss,liveStatus)=>{
    var schedule = require('node-schedule');
    // 系统开奖job
    let insertj = schedule.scheduleJob('00 05 18 * * *', function () {
        // 根据系统设定不同采用不同的开奖模式
        console.log("自动任务执行插入数据");
        
        let systemInfo = require("./model/systemModel");
        systemInfo.findOne().then(sys=>{
            if (sys.status == 1) {
                if (sys.type == 1) {
                    //系统开奖
                    let mockData = require("./mockData");
                    mockData('1');
                    
                } else if ( sys.type == 2){
                    //自定义开奖
                    let Customize = require("./model/customizeModel");
                    let date = new Date().toLocaleDateString().replace(/\//g, '-');
                    customize = new Customize();
                    Customize.findOne({ _id: date }).then(cust => {

                        if(cust){
                            let data1 = {
                                "first":{
                                    index: cust.firstPrise.index,
                                    number: cust.firstPrise.number,
                                    date:new Date(),
                                    msg:"自定义开奖首奖"
                                },
                                "second": {
                                    index: cust.secondPrise.index,
                                    number: cust.secondPrise.number,
                                    date: new Date(),
                                    msg: "自定义开奖二奖"
                                },
                                "third": {
                                    index: cust.thirdPrise.index,
                                    number: cust.thirdPrise.number,
                                    date: new Date(),
                                    msg: "自定义开奖三奖"
                                },
                                special:[],
                                comfort:[]
                            }
                            for (let index = 0; index < cust.speciallyPrise.length; index++) {
                                let temp = {
                                    number: cust.speciallyPrise[index].number,
                                    date:new Date(),
                                    msg:"自定义开奖特殊奖"
                                };
                                if (index == cust.firstPrise.index){
                                    temp.newNumber = "----";
                                }
                                if (index == cust.secondPrise.index) {
                                    temp.newNumber = "----";
                                }
                                if (index == cust.thirdPrise.index) {
                                    temp.newNumber = "----";
                                }
                                data1.special.push(temp);
                                if(index < 10){
                                    let comfort = {
                                        number: cust.comfortPrise[index].number,
                                        date: new Date(),
                                        msg: "自定义开奖安慰奖"
                                    };
                                    data1.comfort.push(comfort);
                                }
                            }
                            let data = {
                                "_id": new Date(new Date().getTime() ).toLocaleDateString().replace(/\//g,'-'),
                                "type": 'cust',
                                "firstPrise": data1.first,
                                "secondPrise": data1.second,
                                "thirdPrise": data1.third,
                                "speciallyPrise": data1.special,
                                "comfortPrise": data1.comfort
                            }
                            let Lottery = require("./model/lotteryModel");
                            let lottery = new Lottery(data);
                            lottery.save().then(function (res) {

                                console.log("定时任务插入已设定自定义开奖数据");

                            });
                        }else{
                            let data1 = {
                                "first": {
                                    index: 0,
                                    number: '----',
                                    date: new Date(),
                                    msg: "未设定自定义开奖首奖"
                                },
                                "second": {
                                    index: 1,
                                    number: '----',
                                    date: new Date(),
                                    msg: "未设定自定义开奖二奖"
                                },
                                "third": {
                                    index: 2,
                                    number: '----',
                                    date: new Date(),
                                    msg: "未设定自定义开奖三奖"
                                },
                                special: [],
                                comfort: []
                            }
                            for (let index = 0; index < 13; index++) {
                                let temp = {
                                    number: '----',
                                    date: new Date(),
                                    msg: "未设定自定义开奖特殊奖"
                                };
                                data1.special.push(temp);
                                if (index < 10) {
                                    let comfort = {
                                        number: '----',
                                        date: new Date(),
                                        msg: "未设定自定义开奖安慰奖"
                                    };
                                    data1.comfort.push(temp);
                                }
                            }
                            let data = {
                                "_id": new Date(new Date().getTime() ).toLocaleDateString().replace(/\//g,'-'),
                                "type": 'cust',
                                "firstPrise": data1.first,
                                "secondPrise": data1.second,
                                "thirdPrise": data1.third,
                                "speciallyPrise": data1.special,
                                "comfortPrise": data1.comfort
                            }
                            let Lottery = require("./model/lotteryModel");
                            let lottery = new Lottery(data);
                            lottery.save().then(function (res) {

                                console.log("定时任务插入空白自定义开奖数据");

                            });
                        }
                        
                    }, err => {
                        console.log(err);
                    });
                    
                    
                }else{
                    // 直播开奖
                    
                }
            }
        });

    });
    // 直播开奖job
    let livej = schedule.scheduleJob('00 15 18 * * *', function(){
        console.log("进入直播开奖模式");
        
        liveStatus = true;
        require("./live")(wss, liveStatus);
        
    });
    var endj = schedule.scheduleJob('00 45 18 * * *', function () {
        console.log("直播开奖模式结束");
        
        liveStatus = false;
        require("./live")(wss, liveStatus);
    
    });
}
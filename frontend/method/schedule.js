module.exports = (wss,liveStatus)=>{
    var schedule = require('node-schedule');
    // 系统开奖job
    let insertj = schedule.scheduleJob('37 * * * *', function () {
        // 根据系统设定不同采用不同的开奖模式
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
                                data1.special.push(temp);
                                if(index < 10){
                                    let comfort = {
                                        number: cust.comfortPrise[index].number,
                                        date: new Date(),
                                        msg: "自定义开奖安慰奖"
                                    };
                                    data1.comfort.push(temp);
                                }
                            }
                            let data = {
                                "_id": new Date(new Date().getTime() + 86400000).toLocaleDateString().replace(/\//g,'-'),
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

                                console.log(222);

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
                                "_id": new Date(new Date().getTime() + 86400000).toLocaleDateString().replace(/\//g,'-'),
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

                                console.log(333);

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
    let livej = schedule.scheduleJob('10 * * * *', function(){
        
        liveStatus = true;
        require("./live")(wss, liveStatus);
        
    });
    var endj = schedule.scheduleJob('37 * * * *', function () {
        // if(wss){
        //     wss.close();
        // }
        liveStatus = false;
        require("./live")(wss, liveStatus);
    
    });
}
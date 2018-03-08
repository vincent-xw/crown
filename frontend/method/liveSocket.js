module.exports = (wss,data,cb) =>{
  let broadcast = require("./ws");
  let systemInfo = require("./model/systemModel");
  let Live = require("./model/liveModel");
  systemInfo.findOne().then(sys => {
    if (sys.status == 1) {
      let live = new Live();
      let date = new Date(new Date().toDateString()).toISOString();
      Live.findOne({ "_id": date }).then(res=>{
        
        let result = {
          status:0,
          data:null,
          msg:""
        };
        if(res){
          console.log("查询到直播设置，将更新");
          if(!res.isEnd){
            if (data.isFirst) {//首奖设置
              if (res.speciallyPrise.length != 13) {
                result.status = 2;
                result.msg = "失败。原因：特殊奖奖池未满，不允许设置首奖";
                cb(result);
              } else {
                let speciallyPrise = res.speciallyPrise;
                for(let i = 0 ; i < speciallyPrise.length; i ++){
                  speciallyPrise[i].is1Selected = false;
                }
                speciallyPrise[data.index].is1Selected = true;
                Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, {
                  firstPrise: {
                    number: data.number,
                    index: data.index
                  },
                  speciallyPrise: speciallyPrise,
                }).then(res1 => {

                  if (res1.ok == 1 && res1.nModified == 1) {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "首奖设置成功";
                      broadcast(wss, JSON.stringify(res2));
                      cb(result);
                    });
                  } else {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res1 => {
                      result.data = res1;
                      result.msg = "操作成功，设置未成功"
                      cb(result);
                    });
                  }
                });
              }
            } else if (data.isSecond) {//二奖设置
              if (res.speciallyPrise.length != 13) {
                result.status = 2;
                result.msg = "失败。原因：特殊奖奖池未满，不允许设置二奖";
                cb(result);
              } else {
                let speciallyPrise = res.speciallyPrise;
                for (let i = 0; i < speciallyPrise.length; i++) {
                  speciallyPrise[i].is2Selected = false;
                }
                speciallyPrise[data.index].is2Selected = true;
                Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, {
                  secondPrise: {
                    number: data.number,
                    index: data.index
                  },
                  speciallyPrise: speciallyPrise,
                }).then(res1 => {

                  if (res1.ok == 1 && res1.nModified == 1) {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "二奖设置成功";
                      broadcast(wss, JSON.stringify(res2));
                      cb(result);
                    });
                  } else {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res1 => {
                      result.data = res1;
                      result.msg = "操作成功，设置未成功"
                      cb(result);
                    });
                  }
                });
              }
            } else if (data.isThird) {//三奖设置
              if (res.speciallyPrise.length != 13) {
                result.status = 2;
                result.msg = "失败。原因：特殊奖奖池未满，不允许设置三奖";
                cb(result);
              } else {
                let speciallyPrise = res.speciallyPrise;
                for (let i = 0; i < speciallyPrise.length; i++) {
                  speciallyPrise[i].is3Selected = false;
                }
                speciallyPrise[data.index].is3Selected = true;
                Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, {
                  thirdPrise: {
                    number: data.number,
                    index: data.index
                  },
                  speciallyPrise: speciallyPrise,
                }).then(res1 => {

                  if (res1.ok == 1 && res1.nModified == 1) {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "三奖设置成功";
                      broadcast(wss, JSON.stringify(res2));
                      cb(result);
                    });
                  } else {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res1 => {
                      result.data = res1;
                      result.msg = "操作成功，设置未成功"
                      cb(result);
                    });
                  }
                });
              }
            } else if (data.isSpecially) {//特殊将设置
              let modifiable = true;
              if(data.type == "modify"){
                modifiable = false;
              }
              if (res.speciallyPrise.length == 13 && modifiable) {
                result.status = 3;
                result.msg = "失败。原因：特殊奖奖池已满，插入失败";
                cb(result);
              } else {
                if (res.speciallyPrise[data.specialIndex]) {
                  res.speciallyPrise[data.specialIndex].number = data.number;
                } else {
                  res.speciallyPrise[data.specialIndex] = {
                    number: data.number
                  }
                }

                Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, {
                  speciallyPrise:res.speciallyPrise
                }).then(res1 => {
                  console.log(res1);
                  if (res1.ok == 1 && res1.nModified == 1) {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "特殊奖插入成功";
                      broadcast(wss, JSON.stringify(res2));
                      cb(result);
                    });
                  } else {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "操作成功，插入未成功"
                      cb(result);
                    });
                  }
                });
              }
            } else if (data.isComfort) {//安慰奖设置
              let modifiable = true;
              if (data.type == "modify") {
                modifiable = false;
              }
              if (res.comfortPrise.length == 10 && modifiable) {
                result.status = 3;
                result.msg = "失败。原因：安慰奖奖池已满，插入失败";
                cb(result);
              } else {
                if (res.comfortPrise[data.comfortIndex]) {
                  res.comfortPrise[data.comfortIndex].number = data.number;
                } else {
                  res.comfortPrise[data.comfortIndex] = {
                    number: data.number
                  }
                }

                Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, {
                  comfortPrise:res.comfortPrise
                }).then(res1 => {
                  console.log(res1);
                  if (res1.ok == 1 && res1.nModified == 1) {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "安慰奖插入成功";
                      broadcast(wss, JSON.stringify(res2));
                      cb(result);
                    });
                  } else {
                    Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                      result.data = res2;
                      result.msg = "操作成功，插入未成功"
                      cb(result);
                    });
                  }
                });
              }
            } else if (data.isEnd) {//结束直播
              Live.findOne({ "_id": new Date(new Date().toDateString()).toISOString() }).then(res2 => {
                if (res2.firstPrise.number !== "****" && res2.secondPrise.number !== "****" && res2.thirdPrise.number != "****" && res2.speciallyPrise.length == 13 && res2.comfortPrise.length == 10) {
                  let data1 = {
                    "first": {
                      index: res2.firstPrise.index,
                      number: res2.firstPrise.number,
                      date: new Date(),
                      msg: "直播开奖首奖"
                    },
                    "second": {
                      index: res2.secondPrise.index,
                      number: res2.secondPrise.number,
                      date: new Date(),
                      msg: "直播开奖二奖"
                    },
                    "third": {
                      index: res2.thirdPrise.index,
                      number: res2.thirdPrise.number,
                      date: new Date(),
                      msg: "直播开奖三奖"
                    },
                    special: [],
                    comfort: []
                  };
                  for (let index = 0; index < res2.speciallyPrise.length; index++) {
                    let temp = {
                      number: res2.speciallyPrise[index].number,
                      date: new Date(),
                      msg: "直播开奖特殊奖"
                    };
                    if (index == res2.firstPrise.index) {
                      temp.newNumber = "----";
                    }
                    if (index == res2.secondPrise.index) {
                      temp.newNumber = "----";
                    }
                    if (index == res2.thirdPrise.index) {
                      temp.newNumber = "----";
                    }
                    data1.special.push(temp);
                    if (index < 10) {
                      let comfort = {
                        number: res2.comfortPrise[index].number,
                        date: new Date(),
                        msg: "直播开奖安慰奖"
                      };
                      data1.comfort.push(comfort);
                    }
                  }
                  let liveData = {
                    "_id": new Date(new Date().getTime()).toLocaleDateString().replace(/\//g, '-'),
                    "type": 'live',
                    "firstPrise": data1.first,
                    "secondPrise": data1.second,
                    "thirdPrise": data1.third,
                    "speciallyPrise": data1.special,
                    "comfortPrise": data1.comfort
                  }
                  let Lottery = require("./model/lotteryModel");
                  let lottery = new Lottery(liveData);
                  lottery.save().then(function (res3) {
                    Live.update({ "_id": new Date(new Date().toDateString()).toISOString() }, { isEnd: true }).then(res4 => {
                      if (res4.ok == 1 && res4.nModified == 1) {
                        result.data = true;
                        result.msg = "设置成功结束直播";
                      } else {
                        result.data = false;
                        result.msg = "设置结束直播失败";
                      }
                      let priseData = {
                        status: 0,
                        comfortPrise: [],
                        speciallyPrise: []
                      };
                      priseData.isEnd = { status: true, type: "直播结束" };
                      broadcast(wss, JSON.stringify(priseData));
                      cb(result);
                    });

                  });
                } else {
                  result.data = false;
                  result.msg = "还有待操作数据，结束直播操作不成功";
                  let priseData = {
                    status: 0,
                    comfortPrise: [],
                    speciallyPrise: []
                  };
                  priseData.isEnd = { status: true, type: "直播结束" };
                  broadcast(wss, JSON.stringify(priseData));
                  cb(result);
                }

              });
            } else {//异常数据

            }
          }else{
            result.data = res;
            result.msg = "直播设置已结束";
            result.status = 5;
            cb(result);
          }
            
          
        } else {
          console.log("未查询到直播设置");
          result.data = res;
          cb(result);
        }
      });
      
    }else{
      broadcast(wss, JSON.stringify({ status: 3, msg: "当前暂停开奖" }));
    }
  });
}
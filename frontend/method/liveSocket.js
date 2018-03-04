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
          if (data.isFirst) {//首奖设置
            if (res.speciallyPrise.length != 13) {
              result.status = 2;
              result.msg = "失败。原因：特殊奖奖池未满，不允许设置首奖";
              cb(result);
            } else {
              Live.update({ "period": res.period }, {
                firstPrise: {
                  number: data.number,
                  index: data.index
                }
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
              Live.update({ "period": res.period }, {
                secondPrise: {
                  number: data.number,
                  index: data.index
                }
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
              speciallyPrise[data.index].isSelected = true;
              Live.update({ "period": res.period }, {
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
            if (res.speciallyPrise.length == 13) {
              result.status = 3;
              result.msg = "失败。原因：特殊奖奖池已满，插入失败";
              cb(result);
            } else {
              if (res.speciallyPrise[data.specialIndex]){
                res.speciallyPrise[data.specialIndex].number = data.number;
              }else{
                res.speciallyPrise[data.specialIndex] = {
                  number:data.number
                }
              }
              
              Live.update({ "period": res.period }, res).then(res1 => {
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
            if (res.comfortPrise.length == 10) {
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

              Live.update({ "period": res.period }, res).then(res1 => {
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
              if (res2.firstPrise.number !== "****" && res2.secondPrise.number !== "****" && res2.thirdPrise.number != "****" && res2.speciallyPrise.length == 13 && res2.comfortPrise.length == 10){
                result.data = true;
                result.msg = "设置成功结束直播";
              }else{
                result.data = false;
                result.msg = "还有待操作数据，结束直播操作不成功";
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
          } else {//异常数据

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
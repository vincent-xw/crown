module.exports = (wss, liveStatus)=>{
  // 直播模块，分为系统/自顶开奖与直播开奖两个功能
  let broadcast = require("./ws");
  if(liveStatus){
    let systemInfo = require("./model/systemModel");
    systemInfo.findOne().then(sys => {
      if (sys.status == 1) {
        if (sys.type == 1 || sys.type == 2) {
          let priseData = {
            status: 0,
            comfortPrise: [],
            speciallyPrise: []
          };
          priseData.isBegin = { status: true, type: '系统开奖' };
          broadcast(wss,JSON.stringify(priseData));
          let speIndex = 0, comfortIndex = 0, count = 0;
          let date = new Date(new Date().getTime() + 86400000).toLocaleDateString().replace(/\//g, "-");
          require("../method/getData")({ date: date }, (data) => {
            if (data) {
              let timer = null;
              timer = setInterval(() => {
                if (count >= 0 && count < 13) {
                  priseData.speciallyPrise.push({ number: data.data.speciallyPrise[speIndex].number, type: 'speciallyPrise' });
                  broadcast(wss,JSON.stringify(priseData));
                  speIndex++;
                } else if (count >= 13 && count < 23) {
                  priseData.comfortPrise.push({ number: data.data.comfortPrise[comfortIndex].number, type: 'comfortPrise' });
                  broadcast(wss,JSON.stringify(priseData));
                  comfortIndex++;
                } else if (count >= 23 && count < 26) {
                  if (count == 23) {
                    priseData.firstPrise = { number: data.data.firstPrise.number, type: 'firstPrise', index: data.data.firstPrise.index };
                    broadcast(wss,JSON.stringify(priseData));
                  } else if (count == 24) {
                    priseData.secondPrise = { number: data.data.secondPrise.number, type: 'secondPrise', index: data.data.secondPrise.index };
                    broadcast(wss,JSON.stringify(priseData));
                  } else {
                    priseData.thirdPrise = { number: data.data.thirdPrise.number, type: 'thirdPrise', index: data.data.thirdPrise.index };
                    broadcast(wss,JSON.stringify(priseData));
                  }
                }
                count++;
                if (count == 26) {
                  clearInterval(timer);
                  priseData.isEnd = { status: true, type: "直播结束" };
                  liveStatus = false;
                  broadcast(wss,JSON.stringify(priseData));

                }
              }, 10000);
            }
          });
        } else if (sys.type == 2) {
          broadcast(wss,JSON.stringify({status:1, msg: '自定义开奖', type: sys.type }));
        } else {
          broadcast(wss, JSON.stringify({ status: 2, msg: '直播开奖', type: sys.type }));
        }
      } else {
        broadcast(wss, JSON.stringify({ status: 3, msg: "当前暂停开奖" }));
      }

    });
  }else{
    broadcast(wss, JSON.stringify({ status: 4,msg:"非直播时间"}));
  }
  
}
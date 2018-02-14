module.exports = (wss, liveStatus)=>{
  // 直播模块，分为系统/自顶开奖与直播开奖两个功能
  wss.on('connection', function connection(ws, req) {
    if (liveStatus) {
      let systemInfo = require("./model/systemModel");
      systemInfo.findOne().then(sys => {
        if (sys.status == 1) {
          if (sys.type == 1) {
            let priseData = {
              comfortPrise: [],
              speciallyPrise: []
            };
            priseData.isBegin = { status: true, type: '系统开奖' };
            ws.send(JSON.stringify(priseData));
            let speIndex = 0, comfortIndex = 0, count = 0;
            let date = new Date(new Date().getTime() + 86400000).toLocaleDateString().replace(/\//g, "-");
            require("../method/getData")({ date: date }, (data) => {
              if (data) {
                let timer = null;
                timer = setInterval(() => {
                  if (count >= 0 && count < 13) {
                    priseData.speciallyPrise.push({ number: data.data.speciallyPrise[speIndex].number, type: 'speciallyPrise' });
                    ws.send(JSON.stringify(priseData));
                    speIndex++;
                  } else if (count >= 13 && count < 23) {
                    priseData.comfortPrise.push({ number: data.data.comfortPrise[comfortIndex].number, type: 'comfortPrise' });
                    ws.send(JSON.stringify(priseData));
                    comfortIndex++;
                  } else if (count >= 23 && count < 26) {
                    if (count == 23) {
                      priseData.firstPrise = { number: data.data.firstPrise.number, type: 'firstPrise', index: data.data.firstPrise.index };
                      ws.send(JSON.stringify(priseData));
                    } else if (count == 24) {
                      priseData.secondPrise = { number: data.data.secondPrise.number, type: 'secondPrise', index: data.data.secondPrise.index };
                      ws.send(JSON.stringify(priseData));
                    } else {
                      priseData.firstPrise = { number: data.data.thirdPrise.number, type: 'thirdPrise', index: data.data.thirdPrise.index };
                      ws.send(JSON.stringify(priseData));
                    }
                  }
                  count++;
                  if (count == 26) {
                    clearInterval(timer);
                    priseData.isEnd = { status: true, type: "直播结束" };
                    ws.send(JSON.stringify(priseData));

                  }
                }, 1000);
              }
            });
          } else if (sys.type == 2) {
            ws.send(JSON.stringify({ msg: '自定义开奖', type: sys.type }));
          } else {
            ws.send(JSON.stringify({ msg: '直播开奖', type: sys.type }));
          }
        } else {
          ws.send(JSON.stringify({ msg: "当前暂停开奖" }));
        }

      });
    } else {
      ws.send(JSON.stringify({ msg: "非直播时间" }));
    }
  });
  
  
}
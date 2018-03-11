module.exports = (allcount) => {
  if (!allcount) {
    allcount = 8;
  }
  // 测试开奖
  let draw = require("./geneAutoDraw");
  let timer = null, counter = 0;
  function initPeriod(val) {
    let date = new Date(val);

    let month = date.getMonth() >= 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    let day = date.getDate() >= 9 ? date.getDate() : "0" + date.getDate();

    return date.getFullYear() + month + day;
  }
  let data = [
    {
      first: "8596",
      second: "3563",
      third: "2754",
      special: [
        "2346",
        "5523",
        "7715",
        "7981",
        "3251",
        "4236",
        "3362",
        "5012",
        "0604",
        "2394",
      ],
      comfort: [
        "4061",
        "0027",
        "2026",
        "7230",
        "9769",
        "2984",
        "4778",
        "7498",
        "8267",
        "5883",

      ],
    },
    {
      first: "5794",
      second: "0499",
      third: "1670",
      special: [
        "0353",
        "9091",
        "5549",
        "6637",
        "5125",
        "6172",
        "0448",
        "5092",
        "1404",
        "9887",
      ],
      comfort: [
        "4819",
        "0150",
        "2041",
        "1332",
        "9294",
        "6482",
        "7879",
        "5054",
        "4574",
        "2299",
      ],
    },
    {
      first: "8211",
      second: "0843",
      third: "9728",
      special: [
        "8167",
        "9993",
        "4590",
        "8735",
        "7573",
        "1029",
        "8119",
        "1104",
        "3372",
        "5712",
      ],
      comfort: [
        "5322",
        "9942",
        "8053",
        "3713",
        "6372",
        "9065",
        "6657",
        "1848",
        "1610",
        "3079",
      ],
    },
    {
      first: "6634",
      second: "1827",
      third: "3500",
      special: [
        "5469",
        "1165",
        "2254",
        "7717",
        "3265",
        "8159",
        "0482",
        "4358",
        "2490",
        "8661",
      ],
      comfort: [
        "0330",
        "5159",
        "2322",
        "5484",
        "4590",
        "7582",
        "4624",
        "7462",
        "6364",
        "1118",

      ],
    },
    {
      first: "6841",
      second: "2752",
      third: "4224",
      special: [
        "4642",
        "8417",
        "5168",
        "9988",
        "5236",
        "6254",
        "7515",
        "0527",
        "4258",
        "1985",
      ],
      comfort: [
        "7523",
        "6455",
        "5983",
        "2423",
        "2274",
        "1960",
        "0003",
        "4483",
        "5508",
        "6221",

      ],
    },
    {
      first: "7798",
      second: "0767",
      third: "3452",
      special: [
        "8067",
        "9945",
        "5924",
        "9760",
        "7932",
        "4766",
        "1194",
        "3032",
        "2816",
        "7273",
      ],
      comfort: [
        "0995",
        "3923",
        "1764",
        "4464",
        "1742",
        "8668",
        "0822",
        "8334",
        "3175",
        "5421",

      ],
    },
    {
      first: "7805",
      second: "8369",
      third: "1831",
      special: [
        "4508",
        "4538",
        "1126",
        "2128",
        "3935",
        "9992",
        "0529",
        "8365",
        "0106",
        "1722",
      ],
      comfort: [
        "2834",
        "8441",
        "3362",
        "0084",
        "3295",
        "4523",
        "8873",
        "5003",
        "1468",
        "6264",

      ],
    },
    {
      first: "4333",
      second: "8762",
      third: "0042",
      special: [
        "6231",
        "5166",
        "5732",
        "3829",
        "2327",
        "1405",
        "5692",
        "0208",
        "4628",
        "5312",
      ],
      comfort: [
        "3218",
        "3322",
        "8811",
        "8523",
        "4397",
        "6671",
        "3367",
        "1243",
        "6567",
        "5250",

      ],
    }
  ]
  let zb = [
    [1, 2, 4],
    [7, 12, 1],
    [1, 12, 3],
    [10, 1, 7],
    [1, 3, 10],
    [8, 10, 6],
    [8, 5, 11],
    [1, 5, 2]
  ];
  for(let i = 0; i < data.length; i ++){
    data[i].first = {
      index: zb[i][0],
      number: data[i].first,
      date: new Date(),
      msg: "手动插入首奖"
    }
    data[i].second = {
      index: zb[i][1],
      number: data[i].second,
      date: new Date(),
      msg: "手动插入首奖"
    }
    data[i].third = {
      index: zb[i][2],
      number: data[i].third,
      date: new Date(),
      msg: "手动插入首奖"
    }
    for(let j = 0; j < data[i].special.length; j++){
      let temp = {
        number: data[i].special[j],
        date: new Date(),
        msg: "手动插入特殊奖"
      };
      
      data[i].special[j] = (temp);
      
      let comfort = {
        number: data[i].comfort[j],
        date: new Date(),
        msg: "手动插入安慰奖"
      };
      data[i].comfort[j] = (comfort);
    }
    if (zb[i][0] < data[i].special.length) {
      let temp = {
        number: data[i].first.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.splice(zb[i][0], 0, temp);
    } else {
      let temp = {
        number: data[i].first.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.push(temp)
    }
    if (zb[i][1] < data[i].special.length) {
      let temp = {
        number: data[i].second.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.splice(zb[i][1], 0, temp);
    } else {
      let temp = {
        number: data[i].second.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.push(temp)
    }
    if (zb[i][2] < data[i].special.length) {
      let temp = {
        number: data[i].third.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.splice(zb[i][2], 0, temp);
    } else {
      let temp = {
        number: data[i].third.number,
        date: new Date(),
        msg: "手动插入特殊奖",
        newNumber: "----"
      }
      data[i].special.push(temp)
    }
    
  }

  
  timer = setInterval(() => {
    let Lottery = require("./model/lotteryModel");
    let lottery = new Lottery();
    var result = {
      "status": 500,
      "msg": "sess"
    };
      
    let id = new Date(new Date("2018-03-01").getTime() + (counter * 86400000)).toLocaleDateString().replace(/\//g, '-');

    
    let obj1 = {
      "_id": id,
      "type": 'insert',
      "firstPrise": data[counter].first,
      "secondPrise": data[counter].second,
      "thirdPrise": data[counter].third,
      "speciallyPrise": data[counter].special,
      "comfortPrise": data[counter].comfort
    };
    obj1.period = initPeriod(obj1._id);
    // mock模式
    // if(lott.length != 0){
    //     obj1._id = new Date(new Date(lott[0]._id).getTime()+86400000).toLocaleDateString().replace(/\//g,'-');
    //     obj1.period = initPeriod(obj1._id);
    // }else{
    //     obj1._id = new Date().toLocaleDateString().replace(/\//g,'-');
    //     obj1.period = initPeriod(obj1._id);
    // }

    // 系统开奖模式

    let lottery1 = new Lottery(obj1);
    lottery1.save().then(function (res) {

      // console.log(res);

    });

    counter++;
    if (counter == allcount) {
      clearInterval(timer);
      console.log("结束");

    }
  }, 1000);

}
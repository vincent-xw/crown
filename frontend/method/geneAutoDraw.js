let draw = {
    checkNumber(arr,value){
        for(let i = 0; i < arr.length; i ++){
            if(arr[i] == value){
                return false;
            }
        }
        return true;
    }
};
module.exports =  (obj)=>{
    if(obj){
        if(obj.status == 0){
            return {
                status:1,//暂停开采
                msg:"当前状态为非开采状态"
            }
        }else{
            // 系统开奖
            let data = {
                first:{},
                second:{},
                third:{},
                special:[],
                comfort:[],
            },scount = 0,ccount = 0,pool= 0;
            for(let i = 0; i < obj.data.length; i++){
                let random = Math.round(Math.random());
                if(data.comfort.length <=9 && data.special.length <= 12){
                    if(scount == 2 || ccount == 2 ){
                        let temp = {};
                        if(pool == 0){
                            temp.number = obj.data[i];
                            temp.date = new Date();
                            temp.msg = "连续进入安慰奖2次，此次进入特殊奖";
                            data.special.push(temp);
                            scount = 1;
                            ccount = 0;
                            // console.log(temp.msg);
                        }else{
                            temp.number = obj.data[i];
                            temp.date = new Date();
                            temp.msg = "连续进入特殊奖2次，此次进入安慰奖";
                            data.comfort.push(temp);
                            ccount = 1;
                            scount = 0;
                            // console.log(temp.msg);
                        }
                    }else{
                        
                            let temp = {};
                            
                            if(random == 0){
                                scount ++;
                                if(scount == 2){
                                    pool = 1
                                }else{
                                    pool = 0;
                                }
                                
                                temp.number = obj.data[i];
                                temp.date = new Date();
                                temp.msg = "随机为0进入特殊奖";
                                ccount = 0;
                                data.special.push(temp);
                                // console.log(temp.msg);
                            }else{
                                ccount ++;
                                if(ccount == 2){
                                    pool = 0
                                }else{
                                    pool = 1;
                                }
                                
                                temp.number = obj.data[i];
                                temp.date = new Date();
                                temp.msg = "随机为1进入安慰奖";
                                scount = 0;
                                data.comfort.push(temp);
                                // console.log(temp.msg);
                            }
                        
                    }
                }else{
                    if(data.comfort.length == 10){
                        let temp = {};
                        temp.number = obj.data[i];
                        temp.date = new Date();
                        temp.msg = "安慰奖已满，直接进入特殊奖";
                        data.special.push(temp);
                        // console.log(temp.msg);
                    }else{
                        let temp = {};
                        temp.number = obj.data[i];
                        temp.date = new Date();
                        temp.msg = "特殊奖已满，直接进入安慰奖";
                        data.comfort.push(temp);
                        // console.log(temp.msg);
                    }
                    
                }
            }
            // 进行开奖
            let drawList = [];
            while(drawList.length < 3){
                let randomValue = Math.ceil(Math.random()*12);
                if(draw.checkNumber(drawList,randomValue)){
                    drawList.push(randomValue);
                }
            }
            data.first = data.special[drawList[0]];
            data.second = data.special[drawList[1]];
            data.third = data.special[drawList[2]];

            data.first.index = drawList[0];
            data.second.index = drawList[1];
            data.third.index = drawList[2];

            data.special[drawList[0]].newNumber = "----";
            data.special[drawList[1]].newNumber = "----";
            data.special[drawList[2]].newNumber = "----";
            return {
                status:0,
                msg:"系统开奖数据",
                data:data
            }
        }
    }else{
        return {
            status:2,//参数异常
            msg:"参数异常"
        }
    }
    
}
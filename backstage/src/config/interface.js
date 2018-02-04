export default function(){
    let interfaces = {
        login: {
            login: "/api/login",//登录
            logout: "/api/logout",//退出
        },
        check:"/api/checklogin",
        list:"/api/info/get",//获取历史开奖信息
        setting:"/api/setInfo/get",//获取游戏设置
        update:"/api/setInfo/update",//获取游戏设置
    }
    return interfaces;
    
    
}
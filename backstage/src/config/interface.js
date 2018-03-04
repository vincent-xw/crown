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
        customizeGet:"/api/customize/get",//获取自定义配置
        customizeUpdate:"/api/customize/update",//修改自定义配置
        liveInfo:"/api/info/liveStatus",//获取直播数据
        liveUpdate:"/api/info/liveInsert",//更新直播数据
    }
    return interfaces;
    
    
}
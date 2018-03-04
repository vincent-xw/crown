<template>
    <div class="baseContainer">
        <el-row>
            <div class="container">
                <h2 class="line">直播开奖</h2>
                <el-col :span="12">
                    <span>名称:</span>
                    <span>皇冠4D彩票</span>
                </el-col>
                <el-col :span="12" class="text-right">
                    <span>当前期数:</span>
                    <span>12344</span>
                </el-col>
            </div>
        </el-row>
        <br>
        <el-row v-loading="loading">
            <div class="container">
                <el-col :span="16">
                    <h3>当前开奖信息</h3>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="首奖">
                            <h5>{{form.firstPrise.number}}</h5>
                        </el-form-item>
                        <el-form-item label="二奖">
                            <h5>{{form.secondPrise.number}}</h5>
                        </el-form-item>
                        <el-form-item label="三奖">
                            <h5>{{form.thirdPrise.number}}</h5>
                        </el-form-item>
                        <el-form-item label="特别奖">
                            <div class="prizeContainer">
                                <el-button type="text" v-for="(item,index) in form.speciallyPrise" :key="item._id" @click="showPopover(1,index,item.number)">{{(item.isSelected)?"----":item.number}}</el-button>
                            </div>
                            <el-popover
                                ref="popover5"
                                placement="top"
                                width="360"
                                v-model="visible2">
                                <p>请选择修改号码或者选择成为首/二/三奖</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="updatePop()">修改</el-button>
                                    <el-button type="primary" size="mini" @click="choosePop(1)">首奖</el-button>
                                    <el-button type="primary" size="mini" @click="choosePop(2)">二奖</el-button>
                                    <el-button type="primary" size="mini" @click="choosePop(3)">三奖</el-button>
                                </div>
                            </el-popover>
                        </el-form-item>
                        <el-form-item label="安慰奖">
                        <div class="prizeContainer">
                            <el-button type="text" v-for="(item,index) in form.comfortPrise" :key="item._id" @click="showPopover(2,index,item.number)">{{item.number}}</el-button>
                        </div>
                        <el-popover
                            ref="popover6"
                            placement="top"
                            width="360"
                            v-model="visible1">
                            <p>是否修改号码</p>
                            <div style="text-align: right; margin: 0">
                                <el-button size="mini" type="text" @click="updatePop()">修改</el-button>
                            </div>
                        </el-popover>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" v-if="isEnd" @click="confirmEnd()">结束直播 </el-button>
                        <span v-if="isOK">当前直播设置已经结束</span>
                    </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="8">
                    <h3>号码录入</h3>
                    <br>
                    <h4>请在下方输入要开采的号码</h4>
                    <br>
                    <el-form ref="liveForm" :rules="rules" :model="liveForm" label-width="80px">
                        <el-form-item label="奖池">
                            <el-radio v-model="liveForm.radio" label="1">特殊奖</el-radio>
                            <el-radio v-model="liveForm.radio" label="2">安慰奖</el-radio>
                        </el-form-item>
                        <el-form-item label="号码" prop="number">
                            <el-input v-model="liveForm.number"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="confirm" :disabled="isEnd">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </div>
        </el-row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                form:{
                    firstPrise:{},
                    secondPrise:{},
                    thirdPrise:{},
                    sepcialPrise:[],
                    comfortPrise:[],
                },
                visible2:false,
                visible1:false,
                selected : {
                    value:"",
                    index:"",
                },
                index:1,
                // 直播录入
                liveForm:{
                    radio:"1",
                    number:"",
                },
                rules:{
                    number:[
                        {
                            required:true,message:"请输入开采号码",trigger:"blur"
                        },
                        {
                            pattern:/^\d{4,4}$/,message:"请输入正确格式的开采号码"
                        }
                    ]
                },
                // 加载
                loading:true,
                // 结束开奖
                isEnd:false,
                // 结束label
                isOK:false,
            }
        },
        created(){
            this.$message.warning("正在加载配置信息请稍后");
            this.loadinfo();
            
        },
        methods:{
            // 加载数据
            loadinfo(){
                let self = this;
                self.loading = true;
                self.$axios.post(self.$interfaces.liveInfo,{type:"check"}).then(res=>{
                    self.loading = false;
                    if(res.status == 200){
                        self.$message.success("加载成功");
                        self.form = res.data.data;
                        self.isOK = res.data.isOk;
                        self.isEnd = res.data.isEnd;
                        this.endLive();
                    }else{
                        self.$message.error(res.msg||"加载失败");
                    }
                });
            },
            // 确认提交
            confirm() {
                let self = this;
                this.$refs.liveForm.validate((valid) => {
                    if (valid) {
                        const h = this.$createElement;
                        this.$msgbox({
                            title: '提示',
                            message: h('p', null, [
                                h('span', null, '确定提交号码: '),
                                h('span', self.liveForm.number),
                                h('span', null, ' 到奖池: '),
                                h('span', self.liveForm.radio==1?"特殊奖":"安慰奖"),
                            ]),
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(action => {
                            let data = {
                                date:new Date().toLocaleDateString().replace(/\//g,'-'),
                                number:self.liveForm.number,
                                type:"update",
                                specialIndex : self.form.speciallyPrise.length || 0,
                                comfortIndex : self.form.comfortPrise.length || 0
                            }
                            if(self.liveForm.radio == 1){
                                data.isSpecially = true;
                            }else{
                                data.isComfort = true;
                            }
                            self.$axios.post(self.$interfaces.liveUpdate,data).then(res=>{
                                if(res.data.status == 200){
                                    self.$message.success(res.data.msg ||"发布成功");
                                    self.form = res.data.data;
                                    self.liveForm.number = "";
                                }else{
                                    self.$message.error(res.data.msg||"发布失败，未知原因");
                                }
                            });
                            
                        }).catch(error=>{
                            console.log(error);
                            
                            this.$message({
                                type: 'error',
                                message: '出现错误'
                            });
                            
                        });
                    } else {
                        self.$message.error("输入号码非法，请重试");
                        return false;
                    }
                });
                
            },
            // 修改直播已录入号码
            change(type,index,obj){
                let self = this;
                this.$prompt('请输入号码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\d{4,4}$/,
                    inputValue:obj,
                    inputErrorMessage: '号码格式不正确'
                }).then(({ value }) => {
                    let data = {
                        date:new Date().toLocaleDateString().replace(/\//g,'-'),
                        number:value,
                        type:"update",
                        specialIndex : index ,
                        comfortIndex : index
                    }
                    if(type == 1){
                        data.isSpecially = true;
                    }else{
                        data.isComfort = true;
                    }
                    self.$axios.post(self.$interfaces.liveUpdate,data).then(res=>{
                        self.visible2 = false;
                        self.visible1 = false;
                        if(res.data.status == 200){
                            self.$message.success(res.data.msg || "更新成功");
                            self.form = res.data.data;
                            self.liveForm.number = "";
                            this.endLive();
                        }else{
                            self.$message.error(res.data.msg||"更新失败，未知原因");
                        }
                    });
                    
                }).catch((error) => {
                    console.log(error);
                    
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });       
                });
                
            },
            // 弹popover
            showPopover(type,index,value){
                let self= this;
                
                self.selected.value = value;
                self.selected.index = index;
                self.selected.type = type;
                if(type == 1){
                    self.visible2 = true;
                }else{
                    self.visible1 = true;
                }
                
                
            },
            // pop修改
            updatePop(){
                let self = this;
                this.change(self.selected.type,self.selected.index,self.selected.value);
            },
            // pop选择奖
            choosePop(val){
                let self = this;
                let data = {
                    date:new Date().toLocaleDateString().replace(/\//g,'-'),
                    number:self.selected.value,
                    type:"update",
                    index:self.selected.index,
                }
                if(val == 1){
                    data.isFirst = true;
                    self.visible2 = false;
                }else if(val == 2){
                    data.isSecond = true;
                    self.visible2 = false;
                }else{
                    data.isThird = true;
                    self.visible2 = false;
                }
                self.$message.warning("请稍后，正在提交");
                self.$axios.post(self.$interfaces.liveUpdate,data).then(res=>{
                    if(res.data.status == 200){
                        self.$message.success(res.data.msg || "提交成功");
                        self.form = res.data.data;
                        self.liveForm.number = "";
                    
                    }else{
                        self.$message.error(res.data.msg||"提交失败，未知原因");
                    }
                });
            },
            // 结束直播
            endLive(){
                let self = this;
                if(!self.isOK){
                    if(self.form.firstPrise.number !== "****"&&self.form.secondPrise.number !== "****" && self.form.thirdPrise.number !="****"&& self.form.speciallyPrise.length == 13&& self.form.comfortPrise.length == 10){
                        self.isEnd = true;
                    }else{
                        self.isEnd = false;
                    }
                }else{
                    self.isEnd = false;
                }
                
            },
            confirmEnd(){
                let self = this;
                let data = {
                    isEnd:true,
                }
                this.$confirm('此操作将结束当天直播, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        self.$axios.post(self.$interfaces.liveUpdate,data).then(res=>{
                            if(res.data.status == 200){
                                self.$message.success(res.data.msg || "操作成功");
                                self.isOK = res.data.data;
                                this.endLive();
                            }else{
                                self.isOK = res.data.data;
                                self.$message.error(res.data.msg||"操作失败，未知原因");
                                this.endLive();
                            }
                        });
                    }).catch(() => {
                             
                });
                
            },
        }
    }
</script>
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
        <el-row>
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
                                <el-button type="text" v-for="(item,index) in form.sepcialPrise" :key="item._id" >{{(item.is1Selected || item.is2Selected || item.is3Selected)?"----":item.number}}</el-button>
                            </div>
                            <el-popover
                                ref="popover5"
                                placement="top"
                                width="360"
                                v-model="visible2">
                                <p>请选择修改号码或者选择成为首/二/三奖</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" >修改</el-button>
                                    <el-button type="primary" size="mini" >首奖</el-button>
                                    <el-button type="primary" size="mini" >二奖</el-button>
                                    <el-button type="primary" size="mini" >三奖</el-button>
                                </div>
                            </el-popover>
                        </el-form-item>
                        <el-form-item label="安慰奖">
                        <div class="prizeContainer">
                            <el-button type="text" v-for="(item,index) in form.comfortPrise" :key="item._id">{{item.number}}</el-button>
                        </div>
                    </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="8">
                    <h3>号码录入</h3>
                    <br>
                    <h4>当前开奖第{{index}}个号码，请在下方输入</h4>
                    <br>
                    <el-form ref="liveForm" :model="liveForm" label-width="80px">
                        <el-form-item label="号码">
                            <el-input v-model="liveForm.number"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="confirm">提交</el-button>
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
                index:1,
                // 直播录入
                liveForm:{
                    number:"",
                }
            }
        },
        methods:{
            confirm() {
                let self = this;

                const h = this.$createElement;
                this.$msgbox({
                    title: '提示',
                    message: h('p', null, [
                        h('span', null, '确定提交号码: '),
                        h('span', self.liveForm.number),
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                    this.$message({
                        type: 'info',
                        message: 'action: ' + action
                    });
                }).catch(error=>{
                    console.log(error);
                    
                });
            }
        }
    }
</script>
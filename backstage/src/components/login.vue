<template>
    <div class="loginBg">
        <el-row>
            <el-card class="box-card">
                <el-col :span="24">
                    <h2 class="text-center">登录</h2>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="ruleForm.userName"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="ruleForm.password"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="">
                            <el-button type="primary" @click="login('ruleForm')" :loading="loading">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <div class="clearfix"></div>
            </el-card>
        </el-row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                ruleForm:{},
                rules:{
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                },
                checked:true,
                loading:false,
            }
        },
        methods:{
            login(formName){
                let self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.loading = true;
                        let data = {
                            userName:self[formName].userName,
                            password:self[formName].password,
                        }
                        self.$axios.post(self.$interfaces.login.login,data).then((res) => {
                            // console.log(res);
                            self.loading = false;
                            if(res.data.status == 0){
                                self.$router.push({name:"index"});
                            }else{
                                self.$message({
                                    message:"登录失败，用户名或密码错误",
                                    type:"error"
                                });
                            }
                            // self.tableData = res.data.list;
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>
<style>
.clearPadding{
    padding-top: 0;
}
.box-card{
    width: 30%;
    margin: 0 auto;
}
.box-card img{
    width: 100%;
}
</style>

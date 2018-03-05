<template>
  <div id="app">
  <el-container>
		<el-header class="el-header">
      <h3 style="color:#FFFFFF">皇冠4D彩票后台管理系统</h3>
      <el-button class="logout" @click="logout">注销</el-button>
    </el-header>
		<el-main>
      <router-view/>
    </el-main>
  </el-container>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  methods:{
    // 注销登录
    logout(){
      let self = this;
      self.$axios.post(self.$interfaces.login.logout).then(res=>{
        self.$router.push({name:"login"});
      });
    },
  }
}
</script>

<style>
blockquote, body, button, dd, dl, dt, fieldset, form, h1, h2, h3, h4, h5, h6, hr, input, legend, li, ol, p, pre, td, textarea, th, ul {
    margin: 0;
    padding: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.logout{
  position: absolute;
  right: 10px;
  top: 10px;
}
.baseContainer{
  width: 80%;
  margin: 0 auto;
}
.container{
  padding: 10px;
  margin: 10px;
  padding-bottom: 0;
  margin-bottom: 0;
}
.line{
  margin-bottom: 10px;
}
.text-center{
  text-align: center;
}
.text-right{
  text-align: right;
}
.prizeContainer{
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: 20px;
}
</style>

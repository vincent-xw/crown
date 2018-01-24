<template>
  <div id="app">
  <el-container>
		<el-header class="el-header">
      <h3>皇冠4D彩票后台管理系统</h3>
      <el-button class="logout">注销</el-button>
    </el-header>
		<el-main>
      <router-view/>
    </el-main>
  </el-container>
    
  </div>
</template>

<script>
export default {
  name: 'App'
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
</style>

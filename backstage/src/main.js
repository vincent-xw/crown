// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import interfaces from './config/interface'

Vue.config.productionTip = false
Vue.prototype.$axios = axios;
Vue.prototype.$interfaces = interfaces();
/* eslint-disable no-new */
// 设置统一拦截
let axiosConf = {
  request: function(axios) {
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // 以form表单形式提交
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // console.log(config);
      if (config.method == "post") {
        var str = [];

        for (var p in config.data) {

          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(config.data[p]));

        }
        config.data = str.join("&");
      }
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
  },
  response: function(axios, router) {
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Do something with response data
      // console.log(response);

      if (response.data.status == 401) {
        router.push({ name: "login" });
      }
      return response;
    }, function (error) {
      // Do something with response error
      return Promise.reject(error);
    });
  }
}
axiosConf.response(axios,router);
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

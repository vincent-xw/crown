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

Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

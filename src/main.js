import Vue from 'vue'
import App from './App'
import router from './router'

//? 引入全局样式
import './assets/css/global.css'
// ?引入图标样式文件
import './assets/fonts/iconfont.css'
// ?引入axios
import axios from 'axios'
// 引入组件库
import elementUI from 'element-ui'
// 注册给vue
Vue.use(elementUI)
// 配置公共根目录,并注册给vue
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// axios请求拦截器,设置token
axios.interceptors.request.use(function (config) {
  // config是axios的内部成员,存有请求头信息
  // console.log(config)
  var token = window.sessionStorage.getItem('token')
  // 给axios配置token
  config.headers.Authorization = token
  // ? 必须有return
  return config
});
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // 使用render渲染组件
  render: h => h(App)
})

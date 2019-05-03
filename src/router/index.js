import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
// 子级路由引入
import Welcome from '@/components/Welcome'

Vue.use(Router)

const router = new Router({
  routes: [
    // {path: '/',name: 'HelloWorld', component: HelloWorld},
    {path: '/',redirect: 'login'},
    {path: '/login',component: Login},
    {path: '/home', component: Home,redirect: 'welcome',children: [
      {path: '/welcome',component: Welcome}
      ]
    },
  ]
})
// ?路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = window.sessionStorage.getItem('token')
  // 非登录页和token为空,回到登录页
  if (to.path !== '/login' && token == null) {
    next('/login')
  }
  // 继续请求路由
  next()
})
export default router

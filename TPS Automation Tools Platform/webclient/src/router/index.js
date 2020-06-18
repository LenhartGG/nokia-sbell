import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { getCookie } from '../common/tools'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    component: Home,
    // redirect: "Home"
    meta: {
      title: 'Home',
      keepAlive: true, // 需要被缓存
      needLogin: true // 需要登录
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      keepAlive: true, // 需要被缓存
      needLogin: true // 需要登录
    }
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: 'About',
      keepAlive: false, // 需要被缓存
      needLogin: true // 需要登录
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login',
      keepAlive: false, // 需要被缓存
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  let isLogin = getCookie('JWT-TOKEN')
  if (to.meta.needLogin) {  // 判断该路由是否需要登录权限
    if (isLogin) { // 判断是否已经登录
      next()
    }
    else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next()
  }
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home.vue'
import Login from '@/views/Login.vue'
import test from '@/views/test.vue'

import { getCookie  } from '@/utils/auth'

Vue.use(VueRouter)

const routes = [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      meta: { 
        requireAuth: true,
      } 
    },
    // {
    //   path: '/filters',
    //   component: Filters,
    //   meta: { 
    //     requireAuth: true,
    //   } 
    // },
    {
      path: '/test',
      component: test,
      meta: { 
        requireAuth: true,
      } 
    }
  ];


const router = new VueRouter({
  mode: 'history',
  routes
});


router.beforeEach((to, from, next) => {
  console.log('requireAuth: ' + to.meta.requireAuth);

  if (to.matched.some(r => r.meta.requireAuth)) {//requireAuth为true, 该页面必须存在token才能访问
      // 自动登录
      var sessionId = getCookie('sessionId')
      var isRemember = getCookie('isRemember')
      
      if( sessionId ){
        next()
      } else {
        console.log('to:', to);
        console.log('from:', from);
        
        next({ path: '/login', query: {redirect: to.fullPath} })
      }
      
  }else {
    next();
  }
})


export default router;
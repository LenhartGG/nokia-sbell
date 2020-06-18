import Vue from 'vue'
import iView from 'iview';
import App from './App.vue'
import router from './router'
import store from '@/store/store'
import axios from '@/request/http'
import VueLoading from 'vue-loading-overlay'
import '@/utils/polyfill.js';
import VueTreeNavigation from 'vue-tree-navigation'; //vue-tree-navigation
// import EasyBar from "easy-bar";
 

//iview
import 'iview/dist/styles/iview.css';
//vue-loading-overlay
import 'vue-loading-overlay/dist/vue-loading.css';

var MATOMO_HOST = "http://135.252.218.139:8018"
Vue.prototype.loading = VueLoading;

Vue.prototype.matomo_host = MATOMO_HOST;
Vue.prototype.trackerUrl = MATOMO_HOST+'matomo.php';
Vue.prototype.siteId = 1;

//vue-loading-overlay
Vue.use(VueLoading, {
  canCancel: false,
  color: '#594E37',
  loader: 'spinner', //spinner/dots/bars
  width: 110,
  height: 110,
  backgroundColor: '#EEEEEE',
  isFullPage: true,
  opacity: 0.8
}); 

Vue.use(iView);

// Vue.use(VueTreeNavigation);

// Vue.use(EasyBar);

Vue.config.productionTip = false;

new Vue({
  axios,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
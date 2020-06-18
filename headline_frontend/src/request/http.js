/**
 * 1.对接口请求与响应做拦截处理
 * 2.封装get,post,put,patch四种请求方式
 * 
 */
import Vue from 'vue'
import axios from 'axios'
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据，暂时未使用是因为我们能够保证使用的是json类型的数据
import store from '../store/store'
import * as types from "@/store/type.js";
import router from '../router.js'
import { Message,Spin } from 'iview'
import { getCookie } from '../utils/auth';


axios.defaults.timeout = 200000; //timeout

// axios.defaults.baseURL = 'http://localhost:3001'; //mock requst host
// axios.defaults.baseURL = 'http://135.252.218.128:8080'; //dev requst host Li Ying
// axios.defaults.baseURL = 'http://135.252.218.128:8443'; //dev requst host Li Ying
// axios.defaults.baseURL = 'http://135.252.217.208:8080'; //dev requst host zewen
// axios.defaults.baseURL = 'http://135.252.218.139:30005'; //deploy http
// axios.defaults.baseURL = 'https://135.252.217.208:8443'; //正式版 https
axios.defaults.baseURL = 'https://headline.int.nokia-sbell.com:8443'; //正式版 https
// axios.defaults.baseURL = 'https://headline.int.nokia-sbell.com:30005'; //测试版 https

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// http request interceptor
axios.interceptors.request.use(    
    config => {      
      // loadSpin()
      if (store.state.sessionId) {
        // config.headers.token = store.state.sessionId; // dev时开启/mock时需要注释掉
        config.headers.token = getCookie('sessionId'); // dev时开启/mock时需要注释掉
      }
      return config
    },
    err => {      
      // cancelSpin()
      return Promise.reject(err)
    },
  )
  
// http response interceptor
axios.interceptors.response.use(
  /**
   * 可以根据HTTP Status Code,也可以根据前后端统一的custom code作为判断条件
   */
  (response) => {    
    // cancelSpin()
    if (response.status === 200) {
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 用户令牌token有效识别 response.data.isSuccess
        // console.log('用户令牌token是否有效：', response.data.isSuccess);
        if(response.data.needLoginAgain){
        // if(true){
            console.log(router);
            
          router.replace({
            path: '/login',
            query: {
                redirect: router.currentRoute.query.redirect
            }
          });
          return;
        }
        return Promise.resolve(response);
    } else {
        // 否则的话抛出错误
        return Promise.reject(response);
    }
  },
  (error) => {    
    // console.log('err' + JSON.stringify(error)) // for debug
    // console.log(JSON.parse(JSON.stringify(error)));
    console.log(error.response);
    
    // error = JSON.parse(JSON.stringify(error))
    // cancelSpin()
    if (error.response && error.response.status) {
      
      switch (error.response.status) {
          // 401: 未登录
          // 未登录则跳转登录页面，并携带当前页面的路径
          // 在登录成功后返回当前页面，这一步需要在登录页操作。  
          case 401:
              router.replace({
                  path: '/login',
                  query: {
                      redirect: router.currentRoute.path
                  }
              });
              break;
              // 403 token过期
              // 登录过期对用户进行提示
              // 清除本地token 
              // 跳转登录页面  
          case 403:
              Message.warm('Error code' + error.response.status + ' token expires. Log back in')
              // 清除token
              store.commit(types.LOGOUT)

              // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
              setTimeout(() => {
                  router.replace({
                      path: '/login',
                      query: {
                          redirect: router.currentRoute.path
                      }
                  });
              }, 1000);
              break;
              // 404请求不存在
          case 404:
              Message.error("Error code:" + error.response.status + '. Request message exception')
              break;
              // 500 服务器内部错误，请联系后台管理员
          case 500:
            Message.error("Error code:" + error.response.status+'. Server error, please contact administrator');
            break;
            // 其他错误，直接抛出错误提示
          default:
            Message.error("Error code:" + error.response.status)
      }
    }
    return Promise.reject(error);
  }
)

function loadSpin(){
    Spin.show({
        render: (h) => {
            return h('div', [
                h('Icon', {
                    'class': 'demo-spin-icon-load',
                    props: {
                        type: 'ios-loading',
                        size: 100
                    }
                })
                // ,
                // h('div', 'Loading')
            ])
        }
    });
}

function cancelSpin(){
  Spin.hide();
}


// Tips：
// 1. axios.get()方法和axios.post()在提交数据时参数的书写方式还是有区别的，需要留意两者略微的区别：
// 2. get请求不需要带参数时,第二个参数是一个{},否则就是个json对象。
// 3. post的第二个参数就是一个参数对象。
/**
 * get
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url,params={}){
  // let params = '';
  // for (const key in data) {
  //   if (data.hasOwnProperty(key)) {
  //     const element = data[key];
  //     params += element;
  //   }
  // }
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params: params
    })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err)
      })
  })
}
 
/**
 * post
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url,params){
  return new Promise((resolve,reject) => {
    axios.post(url,params)
      .then(response => {
        resolve(response);
      },err => {        
        reject(err)
      })
  })
}
 
/**
 * patch
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
      .then(response => {
        resolve(response);
      },err => {
        reject(err)
      })
  })
}
 
/**
 * put
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
      .then(response => {
        resolve(response);
      },err => {
        reject(err)
      })
  })
}

export default axios
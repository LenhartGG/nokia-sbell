/**
 * 管理vuex中的state和mutation
 *  */

import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import * as types from './type'
import { delCookie, setCookie } from '../utils/auth.js';
import * as Cookies from 'js-cookie'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        user: {},
        sessionId: null,
        title: '',
        count: 0,
        isLogin: false
    },
    mutations: {
        [types.LOGIN]: (state, data, userData) => {
            console.log("state, data, userData");
            console.log(state, data, userData);
            
            setCookie('sessionId',data,15);
            state.sessionId = data;
            setCookie('user',userData,15);
            state.user = userData;
            state.isLogin = false;
            // state.setItem('sessionId', sessionId);
            // state.setItem('user', user);
            // state.setItem('isLogin', false);

        },
        [types.LOGOUT]: (state) => {
            delCookie('sessionId');
            delCookie('username');
            delCookie('password');
            delCookie('isRemember');
            // delCookie('isAutoLogin');
            delCookie('isLogin');
            // sessionStorage.removeItem('sessionId');
            // sessionStorage.removeItem('username');
            // sessionStorage.removeItem('password');
            state.sessionId = null;
            // state.user = {};
            state.isLogin = false;
        },
        [types.TITLE]: (state, data) => {
            state.title = data;
        },
        increment (state) {
            state.count++;
        }
    },
    actions: {
        increment (context) {
            context.commit('increment');
        },
        incrementAsync ({ commit }){
            setTimeout(() => {
                commit('increment');
            }, 1000)
        }
    },
    getters:{
        sessionId: state => {
            return state.sessionId;
        },
        userInfo: state =>{
            return state.user;
        }
    },
    plugins: [
        createPersistedState()
        // createPersistedState({
        //   storage: {
        //     getItem: key => Cookies.get(key),
        //     // 参考 https://github.com/js-cookie/js-cookie#json
        //     setItem: (key, value) => Cookies.set(key, value, { expires: 15, secure: true }),
        //     removeItem: key => Cookies.remove(key)
        //   }
        // })
      ]
})
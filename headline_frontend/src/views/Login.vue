<template>
  <!-- login -->
  <div class="login">
    <!-- <MHeader :displayNav="displayNav"></MHeader> -->

    <!-- box -->
    <div class="box">
      <img src="@/assets/images/login-logo.png"/>
      
      <!-- info -->
      <div class="info">
        <img src="@/assets/images/username.png">
        <input type="text" placeholder="NSN-instra" v-model="form.username" @keyup.enter="login" required title="Please input the username"/>
      </div>
      <span v-show="btn & !form.username">Username cannot be empty!</span>

      <div class="info ">
        <img src="@/assets/images/password.png">
        <input type="password" placeholder="Password" v-model="form.password" @keyup.enter="login" required title="Please input the password"/>
      </div>
      <span v-show="btn & !form.password">Password cannot be empty!</span>

      <div class="checkBox">
        <Checkbox v-model="isRemember" size="large">
          Remember my login on this computer
        </Checkbox>
        <Checkbox v-if="false" v-model="isAutoLogin" size="large">
          Automatically login at next time
        </Checkbox>
      </div>
      <!-- loginBtn -->
      <button type="button" :disabled="isLoading"  class="ivu-btn ivu-btn-primary" :class="{'ivu-btn-loading':isLoading}" icon="ios-loading" id="loginBtn" :isLoading=isLoading @click="login">
        <span v-if="!isLoading">Authorize (Automatically login at next time)</span>
        <span v-else>Loading...</span>
      </button>

      <div v-if="isFirefox" class="firefox">
        <p>Please use Chrome or IE to open this system. </p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions } from 'vuex'
import MHeader from '@/components/header.vue';
import * as types from '@/store/type.js'
import * as auth  from '@/utils/auth.js'
import { setBGColorForBody }  from '@/utils/tool.js'
import {toLogin} from "@/request/api.js";
import axios from '@/request/http.js'
import { getCookie, setCookie, delCookie } from '@/utils/auth.js';

export default {
  name: "login",
  data(){
      return{
        isLoading : false,
        displayNav: false,
        btn: false,
        form : {
          // username: "JIRASHGAssistant",
          // password: "Jira@SGHA"
          username: "",
          password: ""
        },
        isRemember: false,
        isAutoLogin: false,
        isFirefox: false,
      }
  },
  created(){
    setBGColorForBody('#fff');
    // 浏览器检测
    this.checkBrowser();
    // cookie检测
    this.checkCookie();
  },
  methods: {
    checkBrowser(){
      if (navigator.userAgent.indexOf("Firefox") > 0) {
        this.isFirefox = true;
      }
    },
    checkCookie(){
        var username = getCookie("username");
        var password = getCookie("password");
        var isRemember = getCookie("isRemember");
        var isAutoLogin = getCookie("isAutoLogin");

        if (isRemember != "" && isRemember!= null) {
          this.isRemember = true;
        } else {
          this.isRemember = false;
        }
        
        if (isAutoLogin != "" && isAutoLogin!= null) {
          this.isAutoLogin = true;
        } else {
          this.isAutoLogin = false;
        }
        
        // this.isAutoLogin=JSON.parse(getCookie("isAutoLogin"));
        // this.isRemember =JSON.parse(getCookie("isRemember"));

        console.log("--登录之前--" 
                    + "\nusername: " + username 
                    + "\npassword: "　+　password 
                    + "\nisRemember: " + isRemember 
                    + "\nisAutoLogin: " + isAutoLogin);
        
        if (this.isRemember || this.isAutoLogin) {
            this.form.username = username;
            this.form.password = password;
        }
        else {
          return;
        }
    },
    RememberLogin(){
      if (this.isRemember || this.isAutoLogin) {
          setCookie("username",this.form.username,15);
          setCookie("password",this.form.password,15);

          if (this.isRemember) {
            setCookie("isRemember",true,15);
          } else {
            delCookie("isRemember");
          }

          if (this.isAutoLogin) {
            setCookie("isAutoLogin",true, 15);
          } else {
            delCookie("isAutoLogin");
          }

      } else {
          // delCookie("username");
          // delCookie("password");
          delCookie("isRemember");
          delCookie("isAutoLogin");
      }
    },
    login(){
      this.btn = true;

      if (!this.form.username || !this.form.password) {
        return;
      }else{
        this.isLoading = true;
      }
      toLogin(this.form)
        .then((response)=>{                   
          var success = response.data.isSuccess;
          var newUser = response.data.isNewUser;
          var sessionId = response.data.token; 
          console.log(response);
          
          if(success){
            this.RememberLogin();
            
            this.isLoading = false;

            // sessionStorage.setItem("username",this.form.username);
            // sessionStorage.setItem("password",this.form.password);
            // sessionStorage.setItem("sessionId",sessionId);
            setCookie('username', this.form.username, 15);
            setCookie('password', this.form.password, 15);
            setCookie("isLogin",true,15);
            setCookie("sessionId",sessionId,15);
            
            this.$store.commit(types.LOGIN, sessionId,this.form);
            
            this.$nextTick(function() {
                let redirect = this.$route.query.redirect || '/';
                if(redirect == '/login'){
                  redirect = '/';
                }
                this.$router.replace({ 
                  path: redirect,
                  query:{
                    currentTabComponent:'homepage',
                    currentActiveName: '1-1'
                  }
                })
            })
          }else{
            console.log(response);
            this.isLoading = false;
            this.$ref.login.class = "ivu-btn ivu-btn-primary"
            this.$Message.error("Username or password is uncorrect!");
          }

        })
        .catch((err) => {
          console.log(err)
          if(err == "Error: Network Error"){
            this.$Message.error("Error: Network Error");
          } else {
            this.$Message.error("Please enter the correct user name or password.");
          }
          this.isLoading = false;
          window.localStorage.removeItem("sessionId");
          delCookie('sessionId');
        });
    },
    decodeURI(uri){
      if(uri == '/'){
        return '/'
      }else{
        return uri.substring(0,uri.lastIndexOf('/'))
      }
    }
  },
  components: {MHeader},
  computed: {}
};
</script>

<style scoped>
.login .checkBox{
  margin-top: 20px;
  margin-left: 5px;
  font-size: 20px;
  font-family: 'Headline Regular';
}
.login .firefox{
  margin-top: 20px;
  font-family: 'Headline Regular';
  font-size: 16px;
  text-align: center;
}

.login ::placeholder { 
  color: rgba(0,0,0,0.25);
  opacity: 1;
}
/* login */

/* box */
.login .box{
  margin: 0 auto;
  padding-top: 129px;
  width: 380px;
  height: 318px;
}
.login .box img{
  margin: 10px 5%;
  width:90%;
}
.login .box span{
  color: red;
}

/* info */
.login .info{
  margin-top: 20px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(217,217,217,1);
}
.login .info img{
  float: left;
  margin: 0 auto;
  padding-top: 8px;
  padding-bottom: 6px;
  padding-left: 10px;
  width: 10%;
  height: 40px;
}
.login .info input{
  padding-left: 10px;
  width:90%;
  height:41px;
  border-radius:3px;
  border:1px solid transparent;
  color:grey;
  font-weight:400;
}

/* loginBtn */
#loginBtn{
  margin-top: 20px;
  text-align: center;
  width:378px;
  height:41px;
  background:rgba(24,144,255,1);
  border-radius:3px;
  color: white;
  font-size: 14px;
}

#loginBtn span{
  color: white;
}

#loginBtn span{
  margin-left: 0;
  text-align: center;
}
</style>


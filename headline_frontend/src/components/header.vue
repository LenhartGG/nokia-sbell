<template>
  <div class="header clearfix">
    <div class="logo">
      <!-- <img src="@/assets/images/NOKIA_SBELL_LOGO_H_RGB_HR1.gif" alt=""> -->
      <img src="@/assets/images/headline-logo2.png" />
      HEADLINE
    </div>
    <div class="header-right">
        <ul class="tips">
          <li>
              <div class="item">
                <div id="person" class="icon person">
                </div>
                <div class="txt">{{ nickname }}</div>
              </div>
          </li>
          <li>
              <div class="item">
                <div @click="logout" class="icon logout"></div>
                <div @click="logout" class="txt">Logout</div>
              </div>
          </li>
          <li v-if="false">
              <div class="item">
                <div class="icon feedback"></div>
                <div class="txt">Feedback</div>
              </div>
          </li>
          <li v-if="false">
              <div class="item">
                <div class="icon help"></div>
                <div class="txt">Help</div>
              </div>
          </li>
          <li>
              <div class="item"
                v-if="false"
                @click="clickNotice">
                <div class="icon notice">
                  <div class="hot-cirlce"
                   v-if="true">
                    20
                  </div>
                </div>
                <div class="txt">Notice</div>
              </div>
          </li>
        </ul>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/request/api.js'
import { getCookie } from '@/utils/auth.js';

export default {
  data () {
    return{
      nickname: '',
    }
  },
  created(){
    this.nickname = getCookie('username');
    this.getUserInfo();
  },
  mounted(){

  },
  methods:{
    clickNotice(){
       this.$Notice.warning({
            title: '1-Critical',
            duration: 5,
            desc: 'Here is the notification description. Here is the notification description. '
        });
       this.$Notice.warning({
            title: '2-Major',
            duration: 5,
            desc: 'Here is the notification description. Here is the notification description. '
        });
       this.$Notice.info({
            title: '3-Minor',
            duration: 5,
            desc: 'Here is the notification description. Here is the notification description. '
        });
       this.$Notice.success({
            title: 'Finish',
            duration: 5,
            desc: 'Here is the notification description. Here is the notification description. '
        });
    },
    logout(){
      this.$store.commit("logout");
      this.$router.push({path: '/login'});
    },
    getUserInfo(){
      getUserInfo().then((result) => {
          if (!result.data) {
            return;
          }
          console.log('----------getUserInfo-------');
          console.log(result.data);
          let avatarUrls = result.data.avatarUrls['48x48'];
          this.setAvatarUrls(avatarUrls);
        }).catch((err) => {
          console.log('----------getUserInfo-------');
          console.log(err);
        });
    },
    setAvatarUrls(avatarUrls){
      let person = document.getElementById('person');
      person.style.backgroundImage = "url("+avatarUrls+")";
    }
  }
}
</script>

<style scoped>
.header{
  background: #2E323F;
}
.logo{
  float: left;
  margin-left: 26px;
  width: 200px;
  height: 80px;
  line-height: 80px;
  font-size:24px;
  font-family:Helvetica;
  color:#5584FF;
}
.logo img{
  margin-top: 20px;
  /* margin-left: 20px; */
  /* width: 200px; */
  height: 40px;
}
.header-right{
  margin-left: 220px;
  min-width: 1000px;
  height: 80px;
  color:rgba(255,255,255,1);
}

.header ul.tips li {
  float: right;
  height: 80px;
}

.tips .item {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.tips .item .txt{
  /* color: #979797; */
  margin-left: auto;
  font-weight: 400;
  font-size: 14px;
}

.tips .item .icon{
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
}
.tips .item .help{
  background-image: url("../assets/images/icon-help.png");
}
.tips .item .feedback{
  background-image: url("../assets/images/icon-feedback.png");
}
.tips .item .logout{
  background-image: url("../assets/images/icon-logout2x.png");
  cursor: pointer;
}
.tips .item .notice{
  background-image: url("../assets/images/icon-notice2.png");
  /* background-size: 21px; */
  position: relative;
}

.hot-cirlce{
  position: absolute;
  top: -2px;
  right: 0;
  width: 15px;
  height: 15px;
  font-size: 9px;
  line-height: 15px;
  text-align: center;
  background: red;
  border-radius: 8px;
}

.tips .item .txt{
  cursor: pointer;
}
.tips .item #person{
  width: 40px;
  height: 40px;
  background-image: url("../assets/images/icon-person.png");
  background-size: 40px;
  margin-right: 5px;
}

</style>

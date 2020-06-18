<template>
    <div class="homepage">
        <!-- headline_breadcrup start -->
        <div class="headline_breadcrup">
            <Breadcrumb>
                <BreadcrumbItem>{{firstbread}}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <!-- headline_breadcrup end -->
        <!-- white_box start -->
        <div class="white_box">
            <div class="box_wrap">
                <!-- mentioned start -->
                <div class="mentioned">
                    <ul class="clearfix">
                        <li>
                            <div class="mentioned_item"
                             @click="clickMentionedme">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: '@Mentioned me', page:1, searchUrl: mentionedUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Mentioned me</p>
                                    <div class="mentionedTotal">
                                    <span class="number">{{mentionedTotal}}</span>
                                    <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/mentioned.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                        <li>
                            <div class="mentioned_item">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: 'Reported by me', page:1, searchUrl: reportedUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Reported by me</p>
                                    <div class="mentionedTotal">
                                        <span class="number">{{reportedTotal}}</span>
                                        <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/reported.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                        <li>
                            <div class="mentioned_item">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: 'Assigned to me', page:1, searchUrl: assignedUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Assigned to me</p>
                                    <div class="mentionedTotal">
                                        <span class="number">{{assignedTotal}}</span>
                                        <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/assigned.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                        <li>
                            <div class="mentioned_item">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: 'Validating by Me', page:1, searchUrl: validatingUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Validating by me</p>
                                    <div class="mentionedTotal">
                                        <span class="number">{{valitorTotal}}</span>
                                        <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/Valitade.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                        <li>
                            <div class="mentioned_item">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: 'Commented by Me', page:1, searchUrl: commentedUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Commented by me</p>
                                    <div class="mentionedTotal">
                                        <span class="number">{{commentedTotal}}</span>
                                        <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/commented.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                        <li>
                            <div class="mentioned_item">
                                <router-link :to="{path: '/', query: { currentTabComponent: 'filters', section: 'section1', filter: 'My Watching List', page:1, searchUrl: WatchingUrl, open: 'open' }}">
                                <div class="item_left">
                                    <p class="title">Watched by me</p>
                                    <div class="mentionedTotal">
                                        <span class="number">{{watchedTotal}}</span>
                                        <span class="open">Open</span>
                                    </div>
                                </div>
                                <div class="item_right">
                                    <img src="@/assets/images/watching.png" alt="">
                                </div>
                                </router-link>
                                <Spin size="large" fix v-show="spinShowMention"></Spin>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- mentioned end -->
                
                <div class="section_bottom clearfix">
                    <!-- bottom_left start -->
                    <div class="changelog bottom_left">
                        <div class="new-event">
                            <div class="right">
                                <span class="evtNumber">{{evtNumber}}</span>
                                <span class="txt">New events in the last 7 days</span>
                            </div>
                        </div>
                        <div class="content">
                        <ul>
                            <li v-for="(item, key1) in changeLogList" :key="key1">
                            <a class="isBorderLeft"
                            href="javascript: void(0)"
                            v-for="(log, key2) in item.changeLog" :key="key2">
                                <div class="item">
                                <div class="item_header clearfix">
                                    <div class="left name"><img :src="item.changeLog[0].author.avatarUrls['48x48']" :title="item.changeLog[0].author.displayName"></div>
                                    <div class="left email">{{ item.changeLog[0].author.emailAddress }}</div>
                                    <div class="right time">{{ item.changeLog[0].created | formatTime }}</div>
                                </div>
                                
                                <div v-for="(record, j) in item.changeLog[0].items" :key="j" class="item_center">
                                    <div class="record clearfix">
                                    <div class="cell key"><p>{{ record.field }}</p></div>
                                    <div class="cell oldvalue"><p>{{ record['fromString'] }}</p></div>
                                    <div class="cell newvalue"><p>{{ record['toString'] }}</p></div>
                                    </div>
                                </div>

                                <div class="item_footer clearfix">
                                    <a :href="httppath + item.key" target="_blank" :title="httppath + item.key">
                                    <div class="txt right">{{ item.key }}</div>
                                    </a>
                                </div>
                                </div>
                            </a>
                            </li>
                        </ul>
                        <div v-show="isLogNothing" class="nothing-data">
                            <span class="txt">Sorry! You don't have new events. </span>
                        </div>
                        <Spin size="large" fix  v-show="spinShowLog"></Spin>
                        </div>
                    </div>
                    <!-- bottom_left end -->
                    <!-- bottom_right start -->
                    <div v-if="false" class="hot-box bottom_right">
                        <div class="top clearfix">
                            <div class="title left">HOT</div>
                            <div class="change right"
                            @click="changeHot">
                                <span class="txt">Change</span>
                                <img src="@/assets/images/icon-change@2x.png" alt="">
                            </div>
                        </div>

                        <div class="hot_mask">
                            <div class="hot_content">
                            <ul>
                                <li v-for="(item, index) in hotIssueList" :key="index">
                                <div class="hot_item">
                                    <div class="title">
                                        <span class="circle"></span>
                                        <a class="key" :href="httppath + item.key" target="_blank">
                                            {{ item.key }}
                                        </a>
                                    </div>
                                    <div class="content"><p>{{ item.summary }}</p></div>
                                </div>
                                </li>
                            </ul>
                            </div>
                            <div v-show="isHotNothing" class="nothing-data">
                                <span class="txt">Sorry! You don't have new events. </span>
                            </div>
                            <Spin size="large" fix v-show="spinShowHot"></Spin>

                        </div>

                    </div>
                    <!-- bottom_right end -->
                </div>

            </div>
        </div>
        <!-- white_box end -->
        <div class="current-release">
            {{dataVersion}}
        </div>
    </div>
</template>

<script>
import { setBGColorForBody } from "@/utils/tool.js";
import { getCookie } from '@/utils/auth.js';
import { getUserInfo, getDataVersion, filterCount, changelog, hotIssues } from "@/request/api.js";

export default {
    data () {
        return {
            dataVersion: '',
            firstbread: 'HOMEPAGE',
            // loading
            spinShowMention: false, // Mentionedme  遮罩
            spinShowLog: false,     // changeLogs   遮罩
            spinShowHot: false,
            // open number
            mentionedTotal: '',
            reportedTotal: '',
            assignedTotal: '',
            valitorTotal: '',
            commentedTotal: '',
            watchedTotal: '',
            // open url
            mentionedUrl: '',
            reportedUrl: '',
            assignedUrl: '',
            validatingUrl: '',
            commentedUrl: '',
            WatchingUrl: '',
            // changeLog active
            isLogActive: false,
            isKey2Active: false,
            isLogHover: false,
            httppath: 'https://optics-jira.int.net.nokia.com/browse/',

            filterCountList: [], // filterCountList
            changeLogList: [],  // changelog
            hotIssueList: [],   // hotIssueList
            evtNumber: 0,
            // nothing-data
            isLogNothing: false,
            isHotNothing: false,
            mentionedCount: 1
        }
    },
    
    created() {
        setBGColorForBody('#2E323F');
        this.getDataVersion();
        this.getFiterCount(); // filterCount
        this.getChangelog();  // changelog in 24h
        this.getHotIssues();  // Hot
        
    },
    methods: {
        clickMentionedme(){
          let username = getCookie("username");
          let sessionId = getCookie("sessionId");
          if(sessionId && username){
            console.log(this.mentionedCount);
          }
        },
        getDataVersion(){
          getDataVersion().then((result) => {
            let data = result.data;
            let version = data.dataversion;
            version = version.substring(0,4) + '/' + version.substring(4,6) + '/' + version.substring(6,8);
            this.dataVersion = 'Current Release is 1.2.1 (Update Time : ' + version + ')';
          }).catch((err) => {
            this.dataVersion = '';
          });
        },
        getFiterCount(){
          this.spinShowMention = true;
          filterCount().then((result) => {
              console.log('------getFiterCount------');
              console.log(result);
              let data = result.data;
              this.mentionedUrl = data.mentioned.searchUrl;
              this.reportedUrl = data.reported.searchUrl;
              this.assignedUrl = data.assigned.searchUrl;
              this.validatingUrl = data.valitor.searchUrl;
              this.commentedUrl = data.commented.searchUrl;
              this.WatchingUrl = data.watched.searchUrl;

              // filterCountList
              this.filterCountList = data;
              this.mentionedTotal = data.mentioned.total;
              this.reportedTotal = data.reported.total;
              this.assignedTotal = data.assigned.total;
              this.valitorTotal = data.valitor.total;
              this.commentedTotal = data.commented.total;
              this.watchedTotal = data.watched.total;
              
              this.spinShowMention = false;
              
          }).catch((err) => {
              console.log('------getFiterCount------');
              console.log(err);
              this.spinShowMention = false;
              
          });
        },
        getChangelog(){
          this.spinShowLog = true;
          changelog().then((result) => {
              console.log('------getChangelog------');
              console.log(result);
              let data = result.data;
              if (!data) {
              return;
              }
              let changeLogs = data.changelog;
              this.evtNumber = data.total;// changelog event count
              if (data.total == 0) {
              this.isLogNothing = true;
              }

              changeLogs.forEach(Log1 => {
                if (Log1.changeLog.length!=0) {
                    Log1.changeLog.forEach(Log2 => {
                        Log2.items.forEach(item => {
                          if (typeof(item['toString']) == 'function'){
                              item['toString'] = '';
                          }
                        })
                    });
                }
              });
              this.changeLogList = changeLogs;
              this.spinShowLog = false;

          }).catch((err) => {
              console.log('------getChangelog------');
              console.log(err);
              this.spinShowLog = false;
              this.isLogNothing = true;

          });

        },
        getHotIssues(){
          this.spinShowHot = true;
          hotIssues().then((result) => {
              console.log('------getHotIssues------');
              console.log(result);
              let data = result.data;
              let total = data.total;
              if (data.total == 0) {
              this.isHotNothing = true;
              }
              let issues = data.issues;
              this.hotIssueList = issues;

              this.spinShowHot = false;

          }).catch((err) => {
              console.log('------getHotIssues------');
              console.log(err);
              this.spinShowHot = false;
              
          });
        },
        changeHot(){
          this.getHotIssues();
        },
    },
    filters:{
        formatTime: function (el) { // | capitalize
            var str1 = el.split('T')[0];
            var str2 = el.split('T')[1];
            str2 = str2.substring(0, 5);
            var fullday = str1.split('-');
            var year = fullday[0];
            var month = fullday[1];
            var day = fullday[2];
            year.substring(year.length-2, year.length);
            var arrayMonth =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            arrayMonth.forEach((element, index) => {
                if(month == (index+1)){
                    month = element;
                }
            });
            return day + '/' + month + '/' + year + ' ' + str2;
        }
    }
}
</script>

<style scoped>
.current-release{
    margin-top: 10px;
    margin-bottom: 20px;
    font-size:12px;
    font-family: 'Headline regular';
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:17px;
}

.headline_breadcrup{
  margin-left: 20px;
  margin-bottom: 10px;
}

/* white_box start */
.white_box{
  background: #fff;
  width: 98%;
  border-radius:6px;
  border: 1px solid #ccc;
  padding: 20px 10px;
}
.box_wrap{
  margin: 0 auto;
  width: 96%;
  padding: 0 20px;
}
.white_box .mentioned>ul>li{
  float: left;
  width: 33.33%;
  padding: 10px 20px;
  position: relative;
}

.mentioned_item{
  margin-bottom: 13px;
  padding: 6px 14px;
  height: 110px;
  box-shadow:0px 2px 7px 0px rgba(0,0,0,0.15);
  border-radius:4px;
  position: relative;
}
.mentioned_item>a{
  display: inline-block;
  width: 100%;
  height: 100%;
}
.mentioned_item .item_left{
  position: absolute;
  width: 60%;
}

.mentioned_item .item_left .mentionedTotal .number{
  margin-left: 10%;
  color: #090990;
  font-size: 40px;
  font-family: "Headline bold";
}
.mentioned_item .item_left .mentionedTotal .open{
    margin-top: 64px;
    margin-left: 10%;
    color: #000;
    font-size: 16px;
}
.mentioned_item .item_left .title{
  margin-bottom: 10px;
  font-size:16px;
  font-family:'Headline Bold';
  font-weight:bold;
  color:rgba(72,72,72,1);
}
.mentioned_item .item_left .txt{
  font-size:12px;
  font-family:'Headline Regular';
  color:rgba(72,72,72,1);
}
.mentioned_item .item_right{
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}


/* section_bottom */
.section_bottom{
  margin-top: 16px;
}
.section_bottom .bottom_left{
  /* float: left;  // 当页面展示Hot部分的时候需要让它们浮动 */
  margin-left: 20px;
  margin-right: 20px;
  /* width:63.5%; */
  width: auto;
  height:533px;
  padding: 10px 30px;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 12px 0px rgba(0,0,0,0.15);
  border-radius:4px;
}
.section_bottom .bottom_right{
  margin-right:20px;
  width:30%;
  height:533px;
  background:rgba(255,255,255,1);
  box-shadow:0px 4px 12px 0px rgba(0,0,0,0.15);
  border-radius:4px;
}

/* changelog */
.changelog{}
.changelog .new-event{
  height: 28px;
  margin-bottom: 4px;
}
.changelog .content{
  position: relative;
}
.changelog .new-event .evtNumber{
  display: inline-block;
  margin-right: 10px;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: rgba(142,206,78,1);
  color: #fff;
  border-radius: 50%;
  font-family: "Headline bold";
}
.changelog .new-event .txt{
  font-size:12px;
  font-weight:300;
  color:rgba(74,144,226,1);
}
.changelog .content{
  height: 460px;
  overflow: auto;
}
.nothing-data{
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 14px;
    font-weight: 400;
    color: rgba(140,140,140,1);
}
.nothing-data .txt{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
 }

.changelog .content ul li.active{
  border-left: 4px solid #4A90E2;
  background: rgba(157,202,255,0.19);
}
.changelog .item{
  margin-bottom: 6px;
  padding: 1%;
  color: #515a6e;
  background: rgba(248,248,248,1);
  border-left: 4px solid #fff;
}
.changelog .isBorderLeft:hover .item{
  border-left: 4px solid #4A90E2;
  background: rgba(157,202,255,0.19);

}
.changelog .item_header{
  padding-top: 10px;
}
.changelog .item_header .name{
  /* width: 5%; */
}
.changelog .item_header .name img{
  margin-top: -10px;
  margin-left: 4px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  vertical-align: middle;
}
.changelog .item_header .email{
  margin-left: 1%;
  font-size: 12px;
  color:rgba(175,175,175,1);
}
.changelog .item_header .email{
  color:rgba(175,175,175,1);
}
.changelog .item_footer{
  font-size: 12px;
}
.changelog .item_footer .txt{
  color:rgba(74,144,226,1);
}
.changelog .item_center {

}
.changelog .item_center .record{
  /* margin-left: 6%; */
  margin-left: 4%;
}
.changelog .item_center .record .cell{
  float: left;
  margin-right: 2%;
  width: 35%;
  min-height: 20px;
}
.changelog .item_center .record .key{
  width: 20%;
}
.changelog .item_center .record .cell p{
  /* 两行换行 */
  overflow:hidden; 
  word-break: break-word;
  text-overflow:ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}



/* hot-box */
.hot-box{
  float: right;
  padding: 1% 2%;
  font-family: "Headline regular";
  position: relative;
}
.hot-box .top .title{
  font-size:18px;
  font-family: "Headline bold";
  font-weight: bold;
  color: rgba(109,109,109,1);
}
.hot-box .top .change{
  cursor: pointer;
}
.hot-box .top .change .txt{
  margin-right: 5px;
  font-size:14px;
  font-weight:400;
  color:rgba(109,109,109,1);
}
.hot-box .top .change img{
  width: 14px;
  vertical-align: middle;
}
.hot_mask{
  position: relative;
}
.hot_content{
  margin-top: 14px;
  height: 460px;
  overflow: auto;
}
.hot_item{
  padding: 7px 0;
  border-bottom: 1px solid #E7E7E7;
}
.hot_item .circle{
  display: inline-block;
  width:10px;
  height:10px;
  border-radius: 50%;
  background:rgba(234,125,125,1);
}
.hot_item .title .key{
  margin-left: 20px;
  font-size:16px;
  font-weight:400;
  /* color:rgba(72,72,72,1); */
}
.hot_item .content{
  padding-left: 30px;
  font-size:14px;
  font-weight:400;
  color:rgba(140,140,140,1);
  line-height:17px;
}
.hot_item .content p{
  /* 两行换行 */
  overflow:hidden; 
  word-break: break-all;
  text-overflow:ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  }
  
</style>
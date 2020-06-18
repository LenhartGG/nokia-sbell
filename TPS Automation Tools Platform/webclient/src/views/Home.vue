<template>
  <div class="home">

    <div class="layout">
      <SideBar
        :openNames="openNames"
        :activeIndex="activeIndex"
        >
      </SideBar>

      <Layout :style="{marginLeft: '200px'}">
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)', padding: '0 20px' }">
          <!-- <div class="breadcrumb"> -->
            <Breadcrumb class="breadcrumb">
              <BreadcrumbItem v-if="fisrtBread" style="color: #515151; font-weight: 700;">{{fisrtBread}}</BreadcrumbItem>
              <BreadcrumbItem v-if="secondBread" style="color: #515151;">{{secondBread}}</BreadcrumbItem>
            </Breadcrumb>
          <!-- </div> -->
          <div class="demo-avatar">
              <!-- <Avatar icon="ios-person" />
              <Avatar>U</Avatar>
              <Avatar>USER</Avatar>
              <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
              <Avatar style="color: #f56a00;background-color: #fde3cf">U</Avatar> -->
              <Avatar style="background-color: #87d068" icon="ios-person" />
              <!-- <router-link v-if="!isLogin" to="Login">Login</router-link> -->
              <span v-if="isLogin"
                style="margin-left: 10px">
                {{userName}}
              </span>

              <a 
                style="margin-left: 10px;"
                href="javascript:void(0)" title="logout"
                @click="handleLogout">
                <img class="icon-more" src="@/assets/images/logout.png" style="width: 24px;" />
              </a>

              <!-- <Dropdown trigger="click" style="margin-left: 10px">
                  <a href="javascript:void(0)">
                    <Icon class="icon-more" type="md-more" size="26" />
                  </a>
                  <DropdownMenu slot="list">
                      <DropdownItem ><div @click="handleLogout">logout</div></DropdownItem>
                  </DropdownMenu>
              </Dropdown> -->
          </div>
        </Header>
        <Content>
          <!-- <Card 
            dis-hover 
            style="min-height: 600px; ">
            <component v-bind:is="currentView"></component>
          </Card> -->
          <div 
            style="min-height: 600px; background: #fff; margin-top: 10px; padding: 20px">
            <!-- 当 `currentView` 改变时，组件也跟着改变 -->
            <component v-bind:is="currentView"></component>
          </div>
        </Content>
      </Layout>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { getCookie, delCookie } from '../common/tools'
import SideBar from '@/components/sidebar.vue'
import NEReboot from './NE-Reboot.vue'
import DBRestore from './DB-Restore.vue'
import DBStart from './DB-Start.vue'
import Form from './form.vue'
import Harddisk from './Harddisk.vue'
import CPU from './CPU.vue'
import TPS_Sync from './TPS_Sync.vue'
import TPS_NE_Temperature from './TPS_NE_Temperature.vue'
import OperationHistory from './OperationHistory'
import ConnectionTopology from './ConnectionTopology'
import Ddm from './Ddm'
import EditableTable from "./nechecklistcli";
import ConfigNETable from "./NECfg";
import TestSetCfg from "./testsetcfg"
import LogCollector from "./LogCollector"

import ConfigProfileLogCollector from './LogCollector/ConfigProfileLogCollector'
import ConfigNELogCollector from './LogCollector/ConfigNELogCollector'
import CollectLogsLogCollector from './LogCollector/CollectLogsLogCollector'

export default {
  name: 'Home',
  data(){
    return{
      fisrtBread: "Home",
      secondBread: "",
      currentView: "NEReboot",
      activeIndex: '5-1',
      openNames: ['5'],

      userName: "",
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // this.openNames = ['5'];
    // this.activeIndex = '5-1';

  },
  methods:{
    init(){
      this.changeBread(this.$route)
      this.isLogin = getCookie("userMsg");
      // this.userName = JSON.parse(unescape(getCookie("userMsg"))).userName;
      this.userName = getCookie("userMsg");
      console.log(this.isLogin);
      console.log(this.userName);
    },
    // updateSidebar(){
    //   this.openNames
    // },
    changeBread(to){
      if(to.query.childNode){
        this.secondBread = to.query.text;
        this.changeView(to.query.childNode);
      }
    },
    changeView(childNode){
      console.log("changeView: "+ childNode);

      this.currentView = childNode
    },
    handleLogout(){
      console.log("handleLogout");
      delCookie("userMsg");
      delCookie("JWT-TOKEN");
      this.$router.push('/login');
    }
  },
  watch:{   //监听路由变化
    $route( to , from ){
      // console.log( to , from )
        // to , from 分别表示从哪跳转到哪，都是一个对象
        // to.path  ( 表示的是要跳转到的路由的地址 eg: /home )
        this.changeBread(to, from);
    },
  },
  components: {
    // HelloWorld,
    SideBar,
    NEReboot,
    DBRestore,
    DBStart,
    Form,
    Harddisk, CPU, TPS_Sync, TPS_NE_Temperature,
    OperationHistory,
    ConnectionTopology,
    Ddm,
    EditableTable,
    ConfigNETable,
    TestSetCfg,
    LogCollector,
    ConfigProfileLogCollector,
    ConfigNELogCollector,
    CollectLogsLogCollector,
  }
}
</script>

<style lang="scss">
.breadcrumb{
  float: left;
}
.demo-avatar{
  float: right;
}
.icon-more{
  vertical-align: -0.4em!important;
}
.ivu-breadcrumb-item-separator{
  color: #515151!important;
}
</style>

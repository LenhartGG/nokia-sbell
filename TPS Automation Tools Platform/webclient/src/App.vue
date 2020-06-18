<template>
  <div id="app">
    <!-- <div id="nav"> 
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>  -->
    <router-view/>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import './assets/css/init.css';

export default {
  name: 'Home',
  data(){
      return{
      }
  },
  mounted() {
    /**
     * 使用document.domain解决iframe父子模块跨域的问题
     */
    // let parentDomain = window.location.hostname;
    // console.log("domain",parentDomain); //localhost
    // document.domain = parentDomain;
  },
  components: {
    // HelloWorld
  }
}
</script>

<style lang="scss">

.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import 'iview/dist/styles/iview.css';
import './assets/css/reset.css';
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
export default {
  data(){
      return{
        
      }
  },
  beforeCreate(){},
  created() {
      const hashLocation= sessionStorage.getItem("hashLocation");//缓存中获取当前页面的路由名称
      if(null != hashLocation){
        const newLocation = hashLocation.split(window.location.host)[1].split("?");
        //matomo
        //api referrence : https://developer.matomo.org/guides/tracking-javascript-guide#internal-search-tracking 
        _paq.push(['setCustomUrl', newLocation[1]]);        
      }else{
        _paq.push(['setCustomUrl', window.location.host])        
      }
  },
  beforeMount(){},
  mounted() {},
  beforeUpdate(){},
  updated(){},
  beforeDestroy(){},
  destroyed(){},
  components: {
    
  },
  computed: {},
  watch: {
    '$route' () {
      let locationHash = window.location.href;
      sessionStorage.setItem("hashLocation",locationHash);//把路由存在缓存中，此处你可以console.log看出路由变化

    }
  }
}
</script>


<style>
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
}
#nav {
  display: none;
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>

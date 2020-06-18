<template>
  <div class="home">

    <Header></Header>
    
    <div class="" style="position:relative">

      <Menu></Menu>

      <div class="headline_container">
          <component v-bind:is="currentTabComponent"></component>
      </div>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from "@/store/store.js";
import Header from "@/components/header";
import Menu from "@/components/menu";
import homepage from "@/components/homepage";
import filters from "@/components/filters";


export default {
  name: "home",
  data() {
    return {
        currentTabComponent: 'homepage',
    };
  },
  components: { Header, Menu, homepage, filters },
  created() {
    this.initHome();
  },
  mounted() {
    
  },
  methods: {
    initHome(){
      let currentTabComponent = this.$route.query.currentTabComponent;
      if(currentTabComponent){
        this.currentTabComponent = this.$route.query.currentTabComponent;
      }
    }
  },
  computed: {
    
  },
  watch: {
     '$route' (to, from) {
        let query = to.query;
        this.currentTabComponent = query.currentTabComponent;
     }
  },
  directives: { // 自定义指令
    focus: { // v-focus
      // 指令的定义
      inserted: function (el) {
        el.focus()
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@import '../assets/css/iview-reset.css'; /* public iview-reset css */
.headline_container{
  margin-left: 220px;
  min-width: 1000px;
}
</style>
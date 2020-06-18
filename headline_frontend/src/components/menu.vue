<template>
  <div class="jira-filters">

    <img class="nokia-logo" src="@/assets/images/nokia-logo1.png" alt="" srcset="">
    
    <div class="menu-search">
      <img src="@/assets/images/icon-search.png" alt="search similar"
        @click="searchSimilar(searchVal)"
      />
      <span class="headline-input">
        <input type="search" v-model="searchVal" v-on:keyup.enter="searchSimilar(searchVal)" placeholder="search similar">
      </span>
    </div>
    
    <menu2 :filterArray="filterArray" ref="menu2"></menu2>

  </div>
</template>

<script>
// @ is an alias to /src
import treeNavigation from "@/components/tree-navigation.vue";
import menu2 from '@/components/menu-test.vue';
import MHeader from "@/components/header.vue";
import HelloWorld from "@/components/HelloWorld.vue";
import { getjirafilterdata } from "@/request/api.js";

export default {
  name: "jira-filters",
  data() {
    return {
      searchVal: '',
      items: [ ], // save Menu items
      // 保存jira的filter
      filterList: [],
      selectedFilter: {},
      currentName: '',
      searchUrl: '',
      
      // menu2
      filterArray: []
    };
  },
  created() {
    this.initData();
    this.getjirafilterdata();
  },
  mounted() {},
  methods: {
    initData(){

    },
    searchSimilar(searchVal){
      console.log(searchVal);
      
      let key = searchVal.trim();
      if(!key){
        return
      }
      this.$router.push({
        path: '/',
        query: {
          currentTabComponent: 'filters',
          section: 'SearchSimilar',
          key: key, 
          count: 50
        }
      });

    },
    getjirafilterdata() {
      let self = this;
      getjirafilterdata()
        .then(result => {
          if (!result.data) {
            return
          }
          console.log(result);
          this.filterArray = result.data.filterArray;
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
  components: {
    treeNavigation,
    menu2
  },
  computed: {
    
  }
};
</script>



<style>
.jira-filters {
    position: absolute;
    /* margin-left: 18px; */
    /* padding-left: 30px;
    padding-top: 20px; */
    width: 200px;
    /* background: #2E323F; */
}
.jira-filters .nokia-logo{
  margin-left: 30px;
  margin-bottom: 10px;
}

.jira-filters .menu-search{
  margin-left: 30px;
  padding: 10px 0;
}
.jira-filters .menu-search img{
  width: 18px;
  margin-right: 2px;
  cursor: pointer;
}
.jira-filters .menu-search .headline-input{
  border-bottom: 1px solid rgba(255,255,255,0.47);

}
.jira-filters .menu-search input{
  width: 130px;
  text-indent: 5px;
  font-size:14px;
  font-family: 'Headline regular';
  font-weight:400;
  color:rgba(255,255,255,0.47);
  line-height:17px;
  outline: none;
  background: #2E323F;
  border: none;
}


</style>

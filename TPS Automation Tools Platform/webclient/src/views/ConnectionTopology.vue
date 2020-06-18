<template>
  <div style="margin:0 auto;">
    <Button type="primary" @click="sendMessage">Apply</Button>
    <iframe
      id="child"
      src="http://135.252.218.138:9096/app/simulator"
      frameborder="0"
      scrolling="yes"
      ref="iframeWin"
    ></iframe>
  </div>
</template>

<style>
iframe{
  width: 100%;
  height: -webkit-fill-available;
}
</style>

<script>

export default {
  components: {},
  data() {
    return {
      msg: "",
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {

  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    sendMessage () {
      // 外部vue向iframe内部传数据    
      // window.frames["child"].document.getElementById("exportFlow").click(); 
      var obj=document.getElementById("child").contentWindow;  
      var ifmObj=obj.document.getElementById("exportFlow");  
      ifmObj.click();
      console.log("---------------------------------")
      console.log(window.jsonFromSonPage)
      console.log("---------------------------------")

    },

  }
};
</script>

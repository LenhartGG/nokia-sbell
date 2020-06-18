<template>
  <Breadcrumb :style="{margin: '16px 0'}">
    <BreadcrumbItem>Common Operation</BreadcrumbItem>
    <BreadcrumbItem :to="bread">{{bread.path}}</BreadcrumbItem>
    <!-- <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Components</BreadcrumbItem>
    <BreadcrumbItem>Layout</BreadcrumbItem> -->
  </Breadcrumb>
</template>

<script>
export default {
  props: {
    bread: Object,
  },
  data(){
    return{
      // bread: { "path": "NE-Reboot", "query": { "openNames": [ "5" ], "activeIndex": "5-1" } }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
